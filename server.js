// server.js
// where your node app starts
// init project
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const passport= require('passport');
const LocalStrategy = require('passport-local');
const session= require('express-session');
var accessCode="";
var util = require('util');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github').Strategy;
var partials = require('express-partials');
var MongoClient= require('mongodb');
var ObjectId= require('mongodb').ObjectID;
var im= require('imagemagick');
var imagesLoaded=require("imagesloaded");
var multer= require('multer');
var upload= multer({ dest: './public'});
var GoogleStrategy= require('passport-google-oauth20');
const nodemailer= require('nodemailer');
var sizeOf= require('image-size');
const requestImageSize = require('request-image-size');

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

var helmet= require('helmet');
app.use(helmet.noCache());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extend:true}));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(partials());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

var FileStore = require('session-file-store')(session);
 
app.use(session({
    store: new FileStore({ttl: 60000*100}),
    secret: 'keyboard cat'
}));


MongoClient.connect(process.env.DB, {useNewUrlParser: true},function(err, db){
    if(err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Successful database connection');



passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://literate-sovereign.glitch.me/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
  
    db.collection('pinterest').find({name:req.user.username}).toArray(function(err,docs){
         if(docs.length>0){

           //console.log('yes')
           
         }
         else{
           
    db.collection('pinterest').insertOne({name:req.user.username, date:Date.now(), active: Date.now(), image:[], icon:""}, function(err,docs){
      console.log('new user has been created')
    
    })                
           
           console.log(req.user.username)
         }	 
		 
    })
    res.redirect('/success');
  });

      
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://literate-sovereign.glitch.me/auth/google/callback',
  scope: 'user:email read:user',
  profileFields : ['id', 'photos', 'name', 'displayName', 'gender', 'profileUrl', 'email']  
  }, 
  function(accessToken, refreshToken, profile, cb){
    return cb(null, profile)
  }
));      
      
      
app.route('/auth/google')
  .get(passport.authenticate('google',{scope:['profile','email']}));


app.route('/auth/google/callback')
  .get(passport.authenticate('google',{failureRedirect: '/error'}),function(req, res) {
    var user= req.user.emails[0].value.replace('@gmail.com','');
    var email= req.user.emails[0].value;
    db.collection('pinterest').find({email:email}).toArray(function(err,docs){
      if(docs.length>0){

      }
      else{
        db.collection('pinterest').find({name:user}).toArray(function(err,docs){
          if(docs.length<1){
            db.collection('pinterest').insertOne({name: user, date: Date.now(), active: Date.now(), image: [], icon: "", email: email}, function(err,docs){
              console.log('new user has been created')
            })
          }
          else{              
            db.collection('pinterest').insertOne({name: '.' + user, date: Date.now(), active: Date.now(), image: [], icon: "", email: email}, function(err,docs){
              console.log('new user has been created 2')
            })
          }
          
        }) 
     }	 
		 
    })
    res.redirect('/success');
  
  });
      
      
var sNum=10;        
      
app.get('/views/index.html', (req, res) => res.redirect('/'));


app.get('/', function(req, res){
  var to=0; var d0=""; req.session.time= Date.now(); var len="";
    
 /*   db.collection('pinterest').find({}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; d0= docs.length;
//      for(var i=0; i<docs.length; i++){
      for(var i=0; i<10; i++){
        if(docs[i]['image'].length>0){ 
           for(var x=0; x<docs[i]['image'].length; x++){
      var r=docs[i]['name']; var r1=docs[i]['icon']; var r2=docs[i]['image'][x][0]; var r3=docs[i]['image'][x][1]; var r4='';
    im.identify(docs[i]['image'][x][0],  function(err, metadata){    
      to++; //arr.push(metadata.width)
 /* if(metadata.width >=metadata.height){
    return("width")
    //arr.push(r,r1,r2,r3,r4); console.log(arr)
  }
  else{    
     return("height")
    //arr.push(r,r1,r2,r3,r4)

  }*/
/*      });
                     
   arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][x][0], docs[i]['image'][x][1], big, docs[i]['image'][x][2]])                             
           }
         }
      }
  // arr.sort((a,b)=>b[5]-a[5])
  //    console.log(req.session.time)
      
  res.render(__dirname+'/views/index.html', { root : __dirname, length:arr.length, arr: arr, del: req.query.del, d0: d0})
      
    })   */    
  
db.collection('pinterest').find({}).toArray(function(err,docs){
  //docs.sort((a,b)=>b['active']-a['active'])
   var arr=[];  var count=""; const big=[]; d0= docs.length;
//      for(var i=0; i<docs.length; i++){
      for(var i=0; i<docs.length; i++){
        if(docs[i]['image'].length>0){ 
           for(var x=0; x<docs[i]['image'].length; x++){
      var r=docs[i]['name']; var r1=docs[i]['icon']; var r2=docs[i]['image'][x][0]; var r3=docs[i]['image'][x][1]; var r4='';
    im.identify(docs[i]['image'][x][0],  function(err, metadata){    
      to++; //arr.push(metadata.width)
 /* if(metadata.width >=metadata.height){
    return("width")
    //arr.push(r,r1,r2,r3,r4); console.log(arr)
  }
  else{    
     return("height")
    //arr.push(r,r1,r2,r3,r4)

  }*/
      });
                     
   arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][x][0], docs[i]['image'][x][1], big, docs[i]['image'][x][2]])                             
           }
         }
      }
   len= arr.length;  
   arr=arr.filter((a)=>a[5]<req.session.time)
   arr.sort((a,b)=>b[5]-a[5])
  
   arr=arr.slice(0,sNum)
  //    console.log(req.session.time)
      
  res.render(__dirname+'/views/index.html', { root : __dirname, length:arr.length, arr: arr, del: req.query.del, d0: d0, len: len})
      
    })  
   
        
});
      

app.get('/success', function(req, res){
        res.redirect('/user/profile.html'); 
  
});
      
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  //console.log(obj['emails'][0].value)
  db.collection('pinterest').find({email: obj['emails'][0]['value']}).toArray(function(err,docs){
    cb(null, docs);
  }) 
});
      

app.get('/auth.html', function(req,res){
  res.sendFile(__dirname+'/auth.html')
})      


app.get('/user/profile.html',ensureAuthenticated, function(req,res){
    var to=0; 
    var named=req.user[0].name;
    if(req.query.user){named= req.query.user;}
    db.collection('pinterest').find({name:named}).toArray(function(err,docs){
    var arr=[]; var count=""; const big=[]; var mArr=docs[0]; var mArr2=[]; var len= docs[0]['image'].length;
      
      
      for(var i=0; i<docs.length; i++){
         if(docs[i]['image'].length>0){ 
           for(var x=0; x<docs[i]['image'].length; x++){
                     
   arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][x][0], docs[i]['image'][x][1], docs[i]['image'][x][2], big])                             
           }
         }
        
      }
   len= arr.length;  
   arr.sort((a,b)=>b[4]-a[4])
  
   arr=arr.slice(0,sNum)

  res.render(__dirname+'/user/profile.html', {length:arr.length, arr: arr, user: req.user[0].name, named: named, rev: mArr, rev2: mArr['image'].length, rev3: mArr2, len: len})
      
    })   
})
      
      
app.post('/likes', ensureAuthenticated, function(req,res){
    var named=req.user[0].name;
  //console.log(req.body+ " me")
  MongoClient.connect(process.env.DB, function(err,db){
    db.collection('pinterest').find({name:req.body.name}).toArray(function(err,docs){
      if(docs.length<1){
        console.log(err)
      }
      else{
        for(var i=0; i<docs[0]["image"].length; i++){
         if(docs[0]["image"][i][2]==req.body.time){
           
           if(docs[0]["image"][i][1].indexOf(named)<0){
               docs[0]["image"][i][1].push(named)
               MongoClient.connect(process.env.DB, function(err,db){
                 db.collection('pinterest').findOneAndUpdate({name:req.body.name},{$set:{image:docs[0]['image'], active: Date.now()}},function(err,docs){
                 })
               })             
           }
           else{
               var index= docs[0]["image"][i][1].indexOf(req.body.name);
               docs[0]["image"][i][1].splice(index,1);
               MongoClient.connect(process.env.DB, function(err,db){
                 db.collection('pinterest').findOneAndUpdate({name:req.body.name},{$set:{image:docs[0]['image'], active: Date.now()}},function(err,docs){
                 })
               })             
           
           }
           
         }
        }
      }   
    })
    db.close();
  })
  console.log(req.body)

})

      
      
app.post('/likes2', ensureAuthenticated, function(req,res){
    var named=req.user[0].name;
  
  //console.log(req.body+ " me")
  MongoClient.connect(process.env.DB, function(err,db){
    db.collection('pinterest').find({name:req.body.name}).toArray(function(err,docs){
      if(docs.length<1){
        console.log(err)
      }
      else{
        for(var i=0; i<docs[0]["image"].length; i++){
         if(docs[0]["image"][i][2]==req.body.time){
           if(docs[0]["image"][i][1].indexOf(named)<0){
               docs[0]["image"][i][1].push(named)
               MongoClient.connect(process.env.DB, function(err,db){
                 db.collection('pinterest').findOneAndUpdate({name:req.body.name},{$set:{image:docs[0]['image'], active: Date.now()}},function(err,docs){
                 })
               })             
           }
           else{
               var index= docs[0]["image"][i][1].indexOf(req.body.name);
               docs[0]["image"][i][1].splice(index,1);
               MongoClient.connect(process.env.DB, function(err,db){
                 db.collection('pinterest').findOneAndUpdate({name:req.body.name},{$set:{image:docs[0]['image'], active: Date.now()}},function(err,docs){
                 })
               })             
           
           }
           
         }
        }
      }   
    })
    db.close();
  })
  console.log(req.body)

})      
      
      
      
app.get('/views/profile.html', function(req,res){
   var to=0;
   var named="test-user"; var len="";
   if(req.query.user){named=req.query.user;}
    db.collection('pinterest').find({name:named}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; len= docs[0].image.length;
      for(var i=0; i<docs.length; i++){
         if(docs[i]['image'].length>0){ 
           for(var x=0; x<docs[i]['image'].length; x++){
      var r=docs[i]['name']; var r1=docs[i]['icon']; var r2=docs[i]['image'][x][0]; var r3=docs[i]['image'][x][1]; var r4='';
    im.identify(docs[i]['image'][x][0],  function(err, metadata){    
      to++; //arr.push(metadata.width)
 /* if(metadata.width >=metadata.height){
    return("width")
    //arr.push(r,r1,r2,r3,r4); console.log(arr)
  }
  else{    
     return("height")
    //arr.push(r,r1,r2,r3,r4)

  }*/
      });
                     
   arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][x][0], docs[i]['image'][x][1], docs[i]['image'][x][2], big])                             
           }
         }
      }
   len= arr.length;  
   arr.sort((a,b)=>b[4]-a[4])
  
   arr=arr.slice(0,sNum)
      
  res.render(__dirname+'/views/profile.html', { root : __dirname, length:arr.length, arr: arr, len: len, named: named})
      
    })         
        
}) 
      
app.get('/views/upload.html', function(req,res){
  
  
  res.render(__dirname+'/views/upload.html')
})

      
app.get('/user/upload.html',ensureAuthenticated, function(req,res){
  var icon= "";
      db.collection('pinterest').find({name:req.user[0].name}, function(err,docs){
        icon= docs.icon;
      })
  
  if(req.query.send == '1'){
    var code= Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString();
  
    MongoClient.connect(process.env.DB, function(err,db){
      db.collection('pinterest3').insertOne({email: req.user[0].email, email2: req.body.email, code:code, date: Date.now()},(err,docs)=>{                                  
      })
    })
  
  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tuqwotrprq@gmail.com',
        pass: process.env.GMAIL_PASSWORD
      }
    });
  
    var mailOptions = {
      from: 'noreply:tuqwotrprq@gmail.com',
      to: req.user[0].email,
      subject: 'Deactivate Account: https://literate-sovereign.glitch.me',
      text: 'Hi,\n\nIn order to deactivate your account, you must use the 6-digit confirmation code provided below on the website. Note- This verification code will only be valid for five minutes.\r\r'+code,
      html: '<div class="emailed" style="min-height:200px; background: #f2f2f2; padding-top: 25px; padding-bottom:25px;"><div class="ins" style="width:500px; margin:auto; min-height: 200px; border: 1px solid #f2f2f2; background: white; padding:35px"><p>Hi,</p><p>In order to deactivate your account (<a href="https://literate-sovereign.glitch.me">https://literate-sovereign.glitch.me</a>), you must enter the 6-digit confirmation code provided below at the following url: https://literate-sovereign.glitch.me/user/upload.html?email=4.</p><p style="background:#dfeff6; width: 100px; padding: 5px; padding-left: 0px; text-align: center; border-radius: 5px;"><b>'+code+'</b></p><p style="color:silver;font-style:italic"><u>Note-</u> This verification code will only be valid for <b>five</b> minutes.</p><p>Sincerely, <br/> The Picture-Share Team</p><p style="margin-top:25px;text-align:right;">&copy; 2019 literate-sovereign.glitch.me</p></div></div>'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
      }
    });   
    
  }
  
  res.render(__dirname+'/user/upload.html', {user: req.user[0].name, icon: icon, email: req.user[0].email, error: req.query.error, emailConfirm: req.query.email})
}) 


app.post('/user/upload.html', ensureAuthenticated, function(req,res){
  db.collection('pinterest').find({name:req.user[0].name}).toArray(function(err,docs){
    if(docs){
      if(req.body.set){
        db.collection('pinterest').findOneAndUpdate({name:req.user[0].name}, {$set:{icon:req.body.url, active: Date.now()}}, function(err,docs1){
          console.log('successful update')
        })            
      }
      else{
      var list= req.body.tags||[];
      
      if(req.body.tags){
        if(list.indexOf(',')>=0){
          list=list.split(' ')
 
          for(var i=0; i<list.length; i++){
            list[i]=list[i].replace(',','')
          }
        }
      } 

  
    if(req.body.url){
      console.log('...')
      docs[0].image.unshift([req.body.url,[],Date.now(),list]); 
    }
    
    //if(!req.body.url && docs[0].image.length<1){docs[0].image=[]} 
    if(req.body.icon){
      docs[0].icon= req.body.icon;
    }
    else{
      req.body.icon="";
    }
    db.collection('pinterest').update({name:req.user[0].name}, {$set:{name:req.user[0].name, image:docs[0].image, active: Date.now(), date: docs[0].date, icon:docs[0].icon, email: docs[0].email}}, function(err,docs1){
      console.log('successful upload')
    
    })    
    }
    }
      
    res.redirect('/user/profile.html')

    })    
 
})
   
var uuN= 10;
      
app.get('/user/users.html', ensureAuthenticated, function(req,res){
var to=0; var d0="";

   db.collection('pinterest').find({}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; var nam=[]; d0= docs.length; var all=[];
      for(var i=0; i<docs.length; i++){
        all.push(docs[i])
      }     
      for(var i=0; i<uuN; i++){
        arr.push(docs[i])
        nam.push(docs[i]['name'])
         if(docs[i]['image'].length>0){ 
           for(var x=0; x<docs[i]['image'].length; x++){
      var r=docs[i]['name']; var r1=docs[i]['icon']; var r2=docs[i]['image'][x][0]; var r3=docs[i]['image'][x][1]; var r4='';
    im.identify(docs[i]['image'][x][0],  function(err, metadata){    
      to++; //arr.push(metadata.width)

      });
                    
  // arr.push([docs[i]['name'],docs[i]['date'], docs[i]['active'], docs[i]['icon'], docs[i]['image'][x][0], docs[i]['image'][x][1], big])                             
           }
         }
      }
      
  res.render(__dirname+'/user/users.html', { root : __dirname, length:arr.length, arr: arr, names: nam, user: req.user[0].name, d0: d0, all: all})
      
    })
})  
      

var uN= 10;
      
app.get('/views/users.html', function(req,res){
  var to=0; var d0=""; var all=[];
    db.collection('pinterest').find({}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; var nam=[]; d0= docs.length;
      for(var i=0; i<docs.length; i++){
        all.push(docs[i])
      }
      for(var i=0; i<uN; i++){
        arr.push(docs[i])
        nam.push(docs[i]['name'])
         if(docs[i]['image'].length>0){ 
           for(var x=0; x<docs[i]['image'].length; x++){
      var r=docs[i]['name']; var r1=docs[i]['icon']; var r2=docs[i]['image'][x][0]; var r3=docs[i]['image'][x][1]; var r4='';
             
    im.identify(docs[i]['image'][x][0],  function(err, metadata){    
      to++; 
      });
                    
           }
         }
      }
      
  res.render(__dirname+'/views/users.html', { root : __dirname, length:arr.length, arr: arr, names: nam, d0: d0, all:all})
      
    })
})        

      
app.get('/delete', ensureAuthenticated, function(req, res){
  if(req.query.value){
    db.collection('pinterest').find({name: req.user[0].name}).toArray(function(err,docs){
      
      var badVal=docs[0].image.splice(req.query.value,1)
      //docs[0].image[req.query.value]="";
      //docs[0].image.filter(x=> x!="")
    db.collection('pinterest').update({name:req.user[0].name}, {$set:{name:req.user[0].name, image:docs[0].image, active: Date.now(), date: docs[0].date, icon:docs[0].icon, email:docs[0].email}}, function(err,docs1){
      console.log('successful upload')
    
    }) 
      
    })
    
    if(req.query.location=='profile'){
      res.redirect('/user/profile.html')        
    }
    else{
      res.redirect('/user/upload.html')  
    }
  }
  else{
    res.redirect('/logout')
  }
  
  
})


var sLimit= 10;


app.get('/user/search.html', ensureAuthenticated, function(req, res){
var to=0;
req.session.time2= Date.now();
  
   db.collection('pinterest').find({}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; var nam=[];
      for(var i=0; i<docs.length; i++){
        arr.push(docs[i])
        nam.push(docs[i]['name'])
         if(docs[i]['image'].length>0){ 
           for(var x=0; x<docs[i]['image'].length; x++){
      var r=docs[i]['name']; var r1=docs[i]['icon']; var r2=docs[i]['image'][x][0]; var r3=docs[i]['image'][x][1]; var r4='';
    im.identify(docs[i]['image'][x][0],  function(err, metadata){    
      to++; 
      });
                    
           }
         }
      }    
     
  res.render(__dirname+'/user/search.html', { root : __dirname, length:arr.length, arr: arr, names: nam, user: req.user[0].name})
      
    })  

})

      
      
app.get('/user/search2', ensureAuthenticated, function(req, res){
  //console.log(req.query.user);
  
   db.collection('pinterest').find({}).toArray(function(err,docs){
     if(docs.length<1){
       res.send({my:'There are no posts with the tag that you entered'})
     }
     var ans=[]; var len="";
     
     for(var i=0; i<docs.length; i++){
       for(var y=0; y<docs[i]['image'].length; y++){
         if(docs[i]['image'][y][3]){
          if(docs[i]['image'][y][3].indexOf(req.query.user)>=0){
            ans.push({name: docs[i]['name'], likes: docs[i]['image'][y][1], image: docs[i]['image'][y][0], icon: docs[i]['icon'], date: docs[i]['image'][y][2], uId: i+'a'+y})
            //ans.push(docs[i])
          }
         }
       }
     }
  
     if(JSON.stringify(ans)=="[]"){
       res.send({my:'There are no posts with the tag that you entered'})
     }
     else{
       //console.log(ans)
   len= ans.length;
   ans=ans.filter((a)=>a.date<req.session.time2)
   ans.sort((a,b)=>b.date-a.date)
   ans=ans.slice(0,sLimit) 
       
       res.send({my: ans, len: len}) 
     }
   })
})

      
app.get('/user/search3', ensureAuthenticated, function(req, res){
  //console.log(req.query.user);
  
   db.collection('pinterest').find({}).toArray(function(err,docs){
     if(docs.length<1){
       res.send({my:'There are no starred posts'})
     }
     var ans=[]; var ans3=[]; var nArr=[];
     
     for(var i=0; i<docs.length; i++){
       for(var y=0; y<docs[i]['image'].length; y++){
         if(docs[i]['image'][y][1]){
          if(docs[i]['image'][y][1].indexOf(req.user[0].name)>=0){
//console.log('y:'+ docs[i]['image'][y][2]+ "; "+i+" "+ y)            
            ans.push({name: docs[i]['name'], likes: docs[i]['image'][y][1], image: docs[i]['image'][y][0], icon: docs[i]['icon'], date: docs[i]['image'][y][2], uId: i+'a'+y})
            //ans.push(docs[i])
          var uId= i+"a"+y;
          var lik= docs[i]['image'][y][1];
          lik=lik.length;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          if(lik>99){
            lik="99+"
          }
          
          var w= 250;
          
          var st= "col-xs-2";
          var imArr= docs[i]['image'][y][1];
            //console.log('1. '+ docs[i]['image'][y][1]+ " 2. "+ y)
          
          if(imArr.indexOf(req.user[0].name) >= 0){
            var st= "col-xs-2 gold";
            //console.log(y)
          }
             
          var lil= docs[i]['image'][y][1].length;
          
          if(lil>99){
            lil= "99+"
          }
             
          ans3.push({time: docs[i]['image'][y][2], value:"<li class='block grid-item' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['image'][y][0]+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta2('"+docs[i]['image'][y][0]+"',event)\"></div><p class='desc' id='i"+uId+"'>a pic by <a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p><div class='col-xs-12 info' id='f"+uId+"' ><div class='col-xs-2' id='g"+uId+"' ><a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\"><img src='"+docs[i]['icon']+"' alt='' onerror=\"this.src='https://cdn4.vectorstock.com/i/1000x1000/43/13/bearded-man-s-face-hipster-character-fashion-vector-18884313.jpg'\"></a></div><div class='col-xs-5'></div><div class='"+st+"' id='h"+uId+"'><div class='star'><button class='bStar "+docs[i]['name']+"' id='bStar"+uId+"'><tim class='timeNo a"+docs[i]['image'][y][2]+"' id='timeNo"+uId+"'></tim><i class='fa fa-star star"+uId+"' id='iStar"+uId+"'></i> <likes id='likes"+uId+"'>"+lil+"</likes></button></div></div></div></li>"})
                    
          var woz= "<li class='block grid-item' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['image'][y][0]+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta2('"+docs[i]['image'][y][0]+"',event)\"></div><p class='desc' id='i"+uId+"'>a pic by <a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p><div class='col-xs-12 info' id='f"+uId+"' ><div class='col-xs-2' id='g"+uId+"' ><a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\"><img src='"+docs[i]['icon']+"' alt='' onerror=\"this.src='https://cdn4.vectorstock.com/i/1000x1000/43/13/bearded-man-s-face-hipster-character-fashion-vector-18884313.jpg'\"></a></div><div class='col-xs-5'></div><div class='"+st+"' id='h"+uId+"'><div class='star'><button class='bStar "+docs[i]['name']+"' id='bStar"+uId+"'><tim class='timeNo a"+docs[i]['image'][y][2]+"' id='timeNo"+uId+"'></tim><i class='fa fa-star star"+uId+"' id='iStar"+uId+"'></i> <likes id='likes"+uId+"'>"+lil+"</likes></button></div></div></div></li>";
          nArr.push([docs[i]['name'],docs[i]['image'][y][1],docs[i]['image'][y][0],docs[i]['icon'],docs[i]['image'][y][2],i+'a'+y, woz])
            
          }
         }
       }
     }
     
     
     
     
 //console.log(nArr)    
     
//console.log(nArr)
  
     if(JSON.stringify(ans)=="[]"){
       res.send({my:'There are no starred posts'})
     }
     else{
       //console.log(ans)
   var len= ans.length;
   ans3.sort((a,b)=>b.time-a.time)
   ans3=ans3.slice(0,sLimit) 
   var ansa=""; var ansa2="";
       for(var z=0; z< ans3.length; z++){
         ansa+=ans3[z].value
         //console.log(ans3[z].time)
       }
       
       ans=ans.slice(0,sLimit);
       
       nArr.sort((a,b)=>b[4]-a[4])
       nArr=nArr.slice(0,sLimit);       
       for(var z=0; z< ans3.length; z++){
         ansa2+=nArr[z][6]
       }
       
       res.send({my: nArr, ansa: ansa2, len: len}) 
     }
   })
})
      
      
app.post('/osearch', upload.single('upfile'), function(req,res){  
  db.collection('pinterest').find({name:req.user[0].name}).toArray(function(err,docs){
    if(docs){
      if(req.body.set){
        db.collection('pinterest').findOneAndUpdate({name:req.user[0].name}, {$set:{icon:'/'+req.file.filename}}, function(err,docs1){
          console.log('successful update')
        })            
      }
      else{
        
      var list= req.body.tags||[];
      
      if(req.body.tags){
        if(list.indexOf(',')>=0){
          list=list.split(' ')
 
          for(var i=0; i<list.length; i++){
            list[i]=list[i].replace(',','')
          }
        }
      } 

  
    if(req.file.filename){
      docs[0].image.unshift(['/'+req.file.filename,[],Date.now(),list]); 
    }
    
    //if(!req.body.url && docs[0].image.length<1){docs[0].image=[]} 
    if(req.body.icon){
      docs[0].icon= req.body.icon;
    }
    else{
      req.body.icon="";
    }
      
    db.collection('pinterest').update({name:req.user[0].name}, {$set:{name:req.user[0].name, image:docs[0].image, active: Date.now(), date: docs[0].date, icon:docs[0].icon, email: docs[0].email}}, function(err,docs1){
      console.log('successful upload')
    
    })    
      
    }
    }
    res.redirect('/user/profile.html')

    })    
  
})
      

app.post('/update-user', ensureAuthenticated, (req,res)=>{
  if(req.body.userN && req.body.email){
    var word= req.body.userN;
    word= word.split('');
    
    if(req.body.email.replace('@gmail.com','')==req.body.email){
      res.redirect('/user/upload.html?error=1')
    }
    else if(word[0]=='.'){
      res.redirect('/user/upload.html?error=1')
    }
    else{
      db.collection('pinterest').find({name:req.body.userN}).toArray(function(err,docs){
        if(docs){
          if(docs.length<1 || ((docs.length==1) && (req.user[0].name==req.body.userN))){ 
            db.collection('pinterest').find({email:req.body.email}).toArray(function(err,docs2){
              if(docs2){
                if(docs2.length<1 || ((docs2.length==1) && (req.user[0].email==req.body.email))){ 
                  db.collection('pinterest').findOneAndUpdate({email:req.user[0].email}, {$set:{name: req.body.userN}}, function(err, docs){
                  })
                  //docs[0].name= req.body.name;
                  //docs[0].email= req.body.email;
                  
                  if(req.body.email != req.user[0].email){
                    
                    
                    
var code= Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString();
  
  MongoClient.connect(process.env.DB, function(err,db){
    db.collection('pinterest2').insertOne({email: req.user[0].email, email2: req.body.email, code:code, date: Date.now()},(err,docs)=>{                                  
    })
  })
  
  
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tuqwotrprq@gmail.com',
    pass: process.env.GMAIL_PASSWORD
  }
});

  
var mailOptions = {
  from: 'noreply:tuqwotrprq@gmail.com',
  to: req.user[0].email,
  subject: 'Email Verification: https://literate-sovereign.glitch.me',
  text: 'Hi,\n\nIn order to change the email address associated with your account, you must use the 6-digit confirmation code provided below on the website. Note- This verification code will only be valid for five minutes.\r\r'+code,
  html: '<div class="emailed" style="min-height:200px; background: #f2f2f2; padding-top: 25px; padding-bottom:25px;"><div class="ins" style="width:500px; margin:auto; min-height: 200px; border: 1px solid #f2f2f2; background: white; padding:35px"><p>Hi,</p><p>In order to change the email address associated with your account (<a href="https://literate-sovereign.glitch.me">https://literate-sovereign.glitch.me</a>), you must enter the 6-digit confirmation code provided below at the following url: https://literate-sovereign.glitch.me/user/upload.html?email=2.</p><p style="background:#dfeff6; width: 100px; padding: 5px; padding-left: 0px; text-align: center; border-radius: 5px;"><b>'+code+'</b></p><p style="color:silver;font-style:italic"><u>Note-</u> This verification code will only be valid for <b>five</b> minutes.</p><p>Sincerely, <br/> The Picture-Share Team</p><p style="margin-top:25px;text-align:right;">&copy; 2019 literate-sovereign.glitch.me</p></div></div>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});                    
                    
                        
                    
                    res.redirect('/user/upload.html?email=1')
                  }
                  else{
                    res.redirect('/user/upload.html?error=3') 
                  }
                  
                  
                }
                else{
                  res.redirect('/user/upload.html?error=2')                  
                }
              }
              else{
                res.redirect('/user/upload.html?error=1')                      
              }
            })          
          }
          else{
            res.redirect('/user/upload.html?error=1')      
          }
        }
        else{
          res.redirect('/user/upload.html?error=1')
        }
        
      })

    }
  }
  else{
    res.redirect('/user/upload.html?error=1')
  }
})

      

app.post('/emailConfirm', ensureAuthenticated, function(req,res){
  var code= req.body.confirm;
  
    db.collection('pinterest2').find({}).toArray((err,docs)=>{
      if(docs.length>0){
      for(var i=docs.length-1; i>=0; i--){
                   // console.log(docs[i].date+" "+(parseInt(Date.now()-300000)-docs[i].date))
        
        if(docs[i].date<=parseInt(Date.now()-300000)){
        //  MongoClient.connect(process.env.DB, function(err,db){
           db.collection('pinterest2').remove({email: docs[i].email, email2: docs[i].email2, code:docs[i].code, date:docs[i].date},(err,docs)=>{
           })
       //   })
        }
      }
      }
    })
  
 // console.log(req.query.email)
    db.collection('pinterest2').find({email: req.user[0].email, code: req.body.confirm}).toArray((err,docs)=>{
      if(docs.length<1){
        res.redirect('/user/upload.html?email=2')
      }
      else{
        if(parseInt(docs[0].date+300000)>= Date.now()){
          
          db.collection('pinterest').findOneAndUpdate({email: req.user[0].email}, {$set:{email: docs[0]['email2']}},function(err,docs){
    
          })          
          
          res.redirect('/logout')
        }
        else{
          res.redirect('/user/upload.html?email=2')          
        } 
      }                               
    })  
  
})
 
      
app.post('/emailConfirm2', ensureAuthenticated, function(req,res){
  var code= req.body.confirm;
  
    db.collection('pinterest3').find({}).toArray((err,docs)=>{
      if(docs.length>0){
      for(var i=docs.length-1; i>=0; i--){
                   // console.log(docs[i].date+" "+(parseInt(Date.now()-300000)-docs[i].date))
        
        if(docs[i].date<=parseInt(Date.now()-300000)){
        //  MongoClient.connect(process.env.DB, function(err,db){
           db.collection('pinterest3').remove({email: docs[i].email, email2: docs[i].email2, code:docs[i].code, date:docs[i].date},(err,docs)=>{
           })
       //   })
        }
      }
      }
    })
  
 // console.log(req.query.email)
    db.collection('pinterest3').find({email: req.user[0].email, code: req.body.confirm}).toArray((err,docs)=>{
      if(docs.length<1){
        res.redirect('/user/upload.html?email=4')
      }
      else{
        if(parseInt(docs[0].date+300000)>= Date.now()){
          
          db.collection('pinterest').deleteOne({email: req.user[0].email}, {$set:{email: docs[0]['email2']}},function(err,docs){
    
          })          
          
          res.redirect('/logout?del=1')
        }
        else{
          res.redirect('/user/upload.html?email=4')          
        } 
      }                               
    })  
  
})      
   
      
app.post('/index/load', function(req,res){
  var interval=sNum; var ans=""; var ans2=[]; var ans3=[]; var ans4= [];
db.collection('pinterest').find({}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; var d0= docs.length;
      for(var i=0; i<docs.length; i++){
        if(docs[i]['image'].length>0){
           for(var y=0; y<docs[i]['image'].length; y++){    
             arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][y][0], docs[i]['image'][y][1], big, docs[i]['image'][y][2]])
             
             
          var uId= i+"a"+y;
          var lik= docs[i]['image'][y][1].length;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          if(lik>99){
            lik="99+"
          }
          
          var w= 250;
          
   
        
        ans3.push({time: docs[i]['image'][y][2], value:"<li class='block grid-item' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['image'][y][0]+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta2('"+docs[i]['image'][y][0]+"',event)\"></div><p class='desc' id='i"+uId+"'>a pic by <a href=\"https://literate-sovereign.glitch.me/views/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p><div class='col-xs-12 info' id='f"+uId+"' ><div class='col-xs-2' id='g"+uId+"' ><a href=\"https://literate-sovereign.glitch.me/views/profile.html?user="+docs[i]['name']+"\"><img src='"+docs[i]['icon']+"' alt='' onerror=\"this.src='https://cdn4.vectorstock.com/i/1000x1000/43/13/bearded-man-s-face-hipster-character-fashion-vector-18884313.jpg'\"></a></div><div class='col-xs-5'></div><div class='col-xs-2' id='h"+uId+"' ><div class='star'><i class='fa fa-star'></i> "+lik+"</div></div></div></li>"})
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans4.push({image:docs[i]['image'][y][0], id: uId, time: docs[i]['image'][y][2]})
             
           }
         }
      }

   arr=arr.filter((a)=>a[5]<req.session.time)
   arr.sort((a,b)=>b[5]-a[5])
  
   ans3=ans3.filter((a)=>a['time']<req.session.time)
   ans3.sort((a,b)=>b['time']-a['time'])
  
   ans4=ans4.filter((a)=>a['time']<req.session.time)
   ans4.sort((a,b)=>b['time']-a['time'])
 // console.log(parseInt(req.body.round)*25)
  
   arr=arr.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)  
   ans3=ans3.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)  
   ans4=ans4.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)
  

   var answer1="";
   for(var l=0; l<ans3.length; l++){
     answer1+=ans3[l].value
   }
  
  //console.log(parseInt(req.body.round)*sNum+" "+ ans3 +" "+ parseInt(req.body.round+1)*sNum)
  
   res.send({ans:answer1, ans2:ans4})
  
})  
  
  
  /*
  db.collection('pinterest').find({}).toArray(function(err,docs){
    for(var i=interval*(parseInt(req.body.round)); i<interval*(parseInt(req.body.round)+1); i++){
      if(docs[i]){
        for(var y=0; y< docs[i]['image'].length; y++){
          
          var uId= i+"a"+y;
          var lik= docs[i]['image'][y][1].length;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          if(lik>99){
            lik="99+"
          }
          
          var w= 250;
          
   
        
        ans+="<li class='block grid-item' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['image'][y][0]+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta2('"+docs[i]['image'][y][0]+"',event)\"></div><p class='desc' id='i"+uId+"'>a pic by <a href=\"https://literate-sovereign.glitch.me/views/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p><div class='col-xs-12 info' id='f"+uId+"' ><div class='col-xs-2' id='g"+uId+"' ><a href=\"https://literate-sovereign.glitch.me/views/profile.html?user="+docs[i]['name']+"\"><img src='"+docs[i]['icon']+"' alt='' onerror=\"this.src='https://cdn4.vectorstock.com/i/1000x1000/43/13/bearded-man-s-face-hipster-character-fashion-vector-18884313.jpg'\"></a></div><div class='col-xs-5'></div><div class='col-xs-2' id='h"+uId+"' ><div class='star'><i class='fa fa-star'></i> "+lik+"</div></div></div></li>";
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans2.push({image:docs[i]['image'][y][0], id: uId})
          
        }
        
      }
    }
    
    res.send({ans:ans, ans2:ans2})
  })*/
})

      
app.post('/index/load2', function(req,res){
  var interval=10; var ans=""; var ans2=[]; var dat="";
  db.collection('pinterest').find({}).toArray(function(err,docs){
    for(var i=interval*(parseInt(req.body.round)); i<interval*(parseInt(req.body.round)+1); i++){
      if(docs[i]){
          dat+=docs[i];
          var uId= i;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          var w= 250;
          
        
        ans+="<li class='block grid-item uList' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['icon']+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta('"+docs[i]['icon']+"',event)\"></div><p class='desc' id='i"+uId+"'>Username: <a href=\"https://literate-sovereign.glitch.me/views/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p></li>";
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans2.push({image:docs[i]['icon'], id: uId})
        
      }
    }
    
    res.send({ans:ans, ans2:ans2, ans3: dat})
  })
})

      
app.post('/index/load3', function(req,res){
  var interval=10; var ans=""; var ans2=[]; var dat="";
  db.collection('pinterest').find({}).toArray(function(err,docs){
    for(var i=interval*(parseInt(req.body.round)); i<interval*(parseInt(req.body.round)+1); i++){
      if(docs[i]){
          dat+=docs[i];
          var uId= i;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          var w= 250;
          
        
        ans+="<li class='block grid-item uList' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['icon']+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta('"+docs[i]['icon']+"',event)\"></div><p class='desc' id='i"+uId+"'>Username: <a href=\"https://literate-sovereign.glitch.me/views/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p></li>";
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans2.push({image:docs[i]['icon'], id: uId})
        
      }
    }
    
    res.send({ans:ans, ans2:ans2, ans3: dat})
  })
})
      

app.post('/index/load4', function(req,res){
  var interval=sNum; var ans=""; var ans2=[]; var ans3=[]; var ans4= [];
db.collection('pinterest').find({name: req.body.name}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; var d0= docs.length;
      for(var i=0; i<docs.length; i++){
        if(docs[i]['image'].length>0){
           for(var y=0; y<docs[i]['image'].length; y++){    
             arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][y][0], docs[i]['image'][y][1], big, docs[i]['image'][y][2]])
             
             
          var uId= i+"a"+y;
          var lik= docs[i]['image'][y][1].length;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          if(lik>99){
            lik="99+"
          }
          
          var w= 250;
          
   
        
        ans3.push({time: docs[i]['image'][y][2], value:"<li class='block grid-item' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['image'][y][0]+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta2('"+docs[i]['image'][y][0]+"',event)\"></div><p class='desc' id='i"+uId+"'>a pic by <a href=\"https://literate-sovereign.glitch.me/views/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p><div class='col-xs-12 info' id='f"+uId+"' ><div class='col-xs-2' id='g"+uId+"' ><a href=\"https://literate-sovereign.glitch.me/views/profile.html?user="+docs[i]['name']+"\"><img src='"+docs[i]['icon']+"' alt='' onerror=\"this.src='https://cdn4.vectorstock.com/i/1000x1000/43/13/bearded-man-s-face-hipster-character-fashion-vector-18884313.jpg'\"></a></div><div class='col-xs-5'></div><div class='col-xs-2' id='h"+uId+"' ><div class='star'><i class='fa fa-star'></i> "+lik+"</div></div></div></li>"})
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans4.push({image:docs[i]['image'][y][0], id: uId, time: docs[i]['image'][y][2]})
             
           }
         }
      }

   arr.sort((a,b)=>b[5]-a[5])
  
   ans3.sort((a,b)=>b['time']-a['time'])
  
   ans4.sort((a,b)=>b['time']-a['time'])
 // console.log(parseInt(req.body.round)*25)
  
   arr=arr.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)  
   ans3=ans3.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)  
   ans4=ans4.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)
  

   var answer1="";
   for(var l=0; l<ans3.length; l++){
     answer1+=ans3[l].value
   }
  
  //console.log(parseInt(req.body.round)*sNum+" "+ ans3 +" "+ parseInt(req.body.round+1)*sNum)
  
   res.send({ans:answer1, ans2:ans4})
  
})  
  
})


app.post('/index/load5', function(req,res){
  var interval=10; var ans=""; var ans2=[]; var dat="";
  db.collection('pinterest').find({}).toArray(function(err,docs){
    for(var i=interval*(parseInt(req.body.round)); i<interval*(parseInt(req.body.round)+1); i++){
      if(docs[i]){
          dat+=docs[i];
          var uId= i;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          var w= 250;
          
        
        ans+="<li class='block grid-item uList' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['icon']+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta('"+docs[i]['icon']+"',event)\"></div><p class='desc' id='i"+uId+"'>Username: <a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p></li>";
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans2.push({image:docs[i]['icon'], id: uId})
        
      }
    }
    
    res.send({ans:ans, ans2:ans2, ans3: dat})
  })
})
      
      
app.post('/index/load6', function(req,res){
  var interval=sNum; var ans=""; var ans2=[]; var ans3=[]; var ans4= [];
db.collection('pinterest').find({name: req.body.name}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; var d0= docs.length;
      for(var i=0; i<docs.length; i++){
        if(docs[i]['image'].length>0){
           for(var y=0; y<docs[i]['image'].length; y++){    
             arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][y][0], docs[i]['image'][y][1], big, docs[i]['image'][y][2]])
             
             
          var uId= i+"a"+y;
          var lik= docs[i]['image'][y][1];
             lik=lik.length;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          if(lik>99){
            lik="99+"
          }
          
          var w= 250;
          
          var st= "col-xs-2";
          var imArr= docs[i]['image'][y][1];
            //console.log('1. '+ docs[i]['image'][y][1]+ " 2. "+ y)
          
          if(imArr.indexOf(req.user[0].name) >= 0){
            var st= "col-xs-2 gold";
            //console.log(y)
          }
             
          var lil= docs[i]['image'][y][1].length;
          
          if(lil>99){
            lil= "99+"
          }
             
        
        ans3.push({time: docs[i]['image'][y][2], value:"<li class='block grid-item' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['image'][y][0]+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta2('"+docs[i]['image'][y][0]+"',event)\"></div><p class='desc' id='i"+uId+"'>a pic by <a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p><div class='col-xs-12 info' id='f"+uId+"' ><div class='col-xs-2' id='g"+uId+"' ><a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\"><img src='"+docs[i]['icon']+"' alt='' onerror=\"this.src='https://cdn4.vectorstock.com/i/1000x1000/43/13/bearded-man-s-face-hipster-character-fashion-vector-18884313.jpg'\"></a></div><div class='col-xs-5'></div><div class='"+st+"' id='h"+uId+"'><div class='star'><button class='bStar "+docs[i]['name']+"' id='bStar"+uId+"'><tim class='timeNo a"+docs[i]['image'][y][2]+"' id='timeNo"+uId+"'></tim><i class='fa fa-star star"+uId+"' id='iStar"+uId+"'></i> <likes id='likes"+uId+"'>"+lil+"</likes></button></div></div></div></li>"})
        
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans4.push({image:docs[i]['image'][y][0], id: uId, time: docs[i]['image'][y][2]})
             
           }
         }
      }

   arr.sort((a,b)=>b[5]-a[5])
  
   ans3.sort((a,b)=>b['time']-a['time'])
  
   ans4.sort((a,b)=>b['time']-a['time'])
 // console.log(parseInt(req.body.round)*25)
  
   arr=arr.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)  
   ans3=ans3.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)  
   ans4=ans4.slice(parseInt(req.body.round)*sNum,(parseInt(req.body.round)+1)*sNum)
  

   var answer1="";
   for(var l=0; l<ans3.length; l++){
     answer1+=ans3[l].value
   }
  
  //console.log(parseInt(req.body.round)*sNum+" "+ ans3 +" "+ parseInt(req.body.round+1)*sNum)
  
   res.send({ans:answer1, ans2:ans4})
  
})  
  
})
  
      

app.post('/index/load7', function(req,res){
  var interval=sNum; var ans=""; var ans2=[]; var ans3=[]; var ans4= [];
  
  
 /* 
db.collection('pinterest').find({}).toArray(function(err,docs){
     if(docs.length<1){
       //res.send({my:'There are no posts with the tag that you entered'})
     }
     var ans=[];
     
     for(var i=0; i<docs.length; i++){
       for(var y=0; y<docs[i]['image'].length; y++){
         if(docs[i]['image'][y][3]){
          if(docs[i]['image'][y][3].indexOf(req.query.user)>=0){
            ans.push({name: docs[i]['name'], likes: docs[i]['image'][y][1], image: docs[i]['image'][y][0], icon: docs[i]['icon'], date: docs[i]['image'][y][2]})
            //ans.push(docs[i])
          }
         }
       }
     }
  
     if(JSON.stringify(ans)=="[]"){
       //res.send({my:'There are no posts with the tag that you entered'})
     }
     else{
       //console.log(ans)

   ans=ans.filter((a)=>a.date<req.session.time2)
   ans.sort((a,b)=>b.date-a.date)
   ans=ans.slice(parseInt(req.body.round)*sLimit,(parseInt(req.body.round)+1)*sLimit) 
       
       res.send({my: ans})   
  
     }
})
  */
  
  
  
  
  
  
    
  
db.collection('pinterest').find({}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; var d0= docs.length;
      for(var i=0; i<docs.length; i++){
        if(docs[i]['image'].length>0){
           for(var y=0; y<docs[i]['image'].length; y++){
             
          
             if(docs[i]['image'][y][3].indexOf(req.body.name)>=0){
             
          arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][y][0], docs[i]['image'][y][1], big, docs[i]['image'][y][2]])
             
             
          var uId= i+"a"+y;
          var lik= docs[i]['image'][y][1];
             lik=lik.length;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          if(lik>99){
            lik="99+"
          }
          
          var w= 250;
          
          var st= "col-xs-2";
          var imArr= docs[i]['image'][y][1];
            //console.log('1. '+ docs[i]['image'][y][1]+ " 2. "+ y)
          
          if(imArr.indexOf(req.user[0].name) >= 0){
            var st= "col-xs-2 gold";
            //console.log(y)
          }
             
          var lil= docs[i]['image'][y][1].length;
          
          if(lil>99){
            lil= "99+"
          }
             
        ans3.push({time: docs[i]['image'][y][2], value:"<li class='block grid-item' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['image'][y][0]+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta2('"+docs[i]['image'][y][0]+"',event)\"></div><p class='desc' id='i"+uId+"'>a pic by <a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p><div class='col-xs-12 info' id='f"+uId+"' ><div class='col-xs-2' id='g"+uId+"' ><a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\"><img src='"+docs[i]['icon']+"' alt='' onerror=\"this.src='https://cdn4.vectorstock.com/i/1000x1000/43/13/bearded-man-s-face-hipster-character-fashion-vector-18884313.jpg'\"></a></div><div class='col-xs-5'></div><div class='"+st+"' id='h"+uId+"'><div class='star'><button class='bStar "+docs[i]['name']+"' id='bStar"+uId+"'><tim class='timeNo a"+docs[i]['image'][y][2]+"' id='timeNo"+uId+"'></tim><i class='fa fa-star star"+uId+"' id='iStar"+uId+"'></i> <likes id='likes"+uId+"'>"+lil+"</likes></button></div></div></div></li>"})
        
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans4.push({image:docs[i]['image'][y][0], id: uId, time: docs[i]['image'][y][2]})
           }
          
          
          
           }
         }
      }
  
   
  
   arr=arr.filter((a)=>a[4]<req.session.time2)  
   arr.sort((a,b)=>b[4]-a[4])
  
   ans3=ans3.filter((a)=>a.time<req.session.time2)  
   ans3.sort((a,b)=>b['time']-a['time'])
  
   ans4=ans4.filter((a)=>a.time<req.session.time2)  
   ans4.sort((a,b)=>b['time']-a['time'])
 // console.log(parseInt(req.body.round)*25)
  
   arr=arr.slice(parseInt(req.body.round)*sLimit,(parseInt(req.body.round)+1)*sLimit)  
   ans3=ans3.slice(parseInt(req.body.round)*sLimit,(parseInt(req.body.round)+1)*sLimit)  
   ans4=ans4.slice(parseInt(req.body.round)*sLimit,(parseInt(req.body.round)+1)*sLimit)
  

   var answer1="";
   for(var l=0; l<ans3.length; l++){
     answer1+=ans3[l].value
   }
  
  //console.log(parseInt(req.body.round)*sNum+" "+ ans3 +" "+ parseInt(req.body.round+1)*sNum)
  
   res.send({ans:answer1, ans2:ans4})
  
})  
  
})      
      

app.post('/index/load8', function(req,res){
  var interval=sNum; var ans=""; var ans2=[]; var ans3=[]; var ans4= [];
  
    
  
db.collection('pinterest').find({}).toArray(function(err,docs){
   var arr=[];  var count=""; const big=[]; var d0= docs.length;
      for(var i=0; i<docs.length; i++){
        if(docs[i]['image'].length>0){
           for(var y=0; y<docs[i]['image'].length; y++){
          
             if(docs[i]['image'][y][1].indexOf(req.user[0].name)>=0){
              //console.log('y:'+y)
            
          arr.push([docs[i]['name'], docs[i]['icon'], docs[i]['image'][y][0], docs[i]['image'][y][1], big, docs[i]['image'][y][2]])
             
             
          var uId= i+"a"+y;
          var lik= docs[i]['image'][y][1];
             lik=lik.length;
          var nem= docs[i]['name'].length;
          var nem2= docs[i]['name'];
          
          if(nem>14){
            nem2=nem.split('').slice(0,13).join('');
          }
          
          if(lik>99){
            lik="99+"
          }
          
          var w= 250;
          
          var st= "col-xs-2";
          var imArr= docs[i]['image'][y][1];
            //console.log('1. '+ docs[i]['image'][y][1]+ " 2. "+ y)
          
          if(imArr.indexOf(req.user[0].name) >= 0){
            var st= "col-xs-2 gold";
            //console.log(y)
          }
             
          var lil= docs[i]['image'][y][1].length;
          
          if(lil>99){
            lil= "99+"
          }
             
        ans3.push({time: docs[i]['image'][y][2], value:"<li class='block grid-item' id='d"+uId+"' ><div class='blockImg'><img src='"+docs[i]['image'][y][0]+"' style='width:"+w+"px' onerror=\"this.src='http://www.greytrix.com/blogs/sageaccpacerp/wp-content/uploads/2012/11/1.-Error-code.bmp'; this.className='badImg'\" id='e"+uId+"' onload=\"getMeta2('"+docs[i]['image'][y][0]+"',event)\"></div><p class='desc' id='i"+uId+"'>a pic by <a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\">@"+nem2+"</a></p><div class='col-xs-12 info' id='f"+uId+"' ><div class='col-xs-2' id='g"+uId+"' ><a href=\"https://literate-sovereign.glitch.me/user/profile.html?user="+docs[i]['name']+"\"><img src='"+docs[i]['icon']+"' alt='' onerror=\"this.src='https://cdn4.vectorstock.com/i/1000x1000/43/13/bearded-man-s-face-hipster-character-fashion-vector-18884313.jpg'\"></a></div><div class='col-xs-5'></div><div class='"+st+"' id='h"+uId+"'><div class='star'><button class='bStar "+docs[i]['name']+"' id='bStar"+uId+"'><tim class='timeNo a"+docs[i]['image'][y][2]+"' id='timeNo"+uId+"'></tim><i class='fa fa-star star"+uId+"' id='iStar"+uId+"'></i> <likes id='likes"+uId+"'>"+lil+"</likes></button></div></div></div></li>"})
        
        //ans2+="getMeta("+docs[i]['image'][y][0]+",event); "
        ans4.push({image:docs[i]['image'][y][0], id: uId, time: docs[i]['image'][y][2]})
           }
          
          
          
           }
         }
      }
  
   
  
   arr.sort((a,b)=>b[4]-a[4])
  
   ans3.sort((a,b)=>b['time']-a['time'])
  
   ans4.sort((a,b)=>b['time']-a['time'])
 // console.log(parseInt(req.body.round)*25)
   arr=arr.slice(parseInt(req.body.round)*sLimit,(parseInt(req.body.round)+1)*sLimit)  
   ans3=ans3.slice(parseInt(req.body.round)*sLimit,(parseInt(req.body.round)+1)*sLimit)  
   ans4=ans4.slice(parseInt(req.body.round)*sLimit,(parseInt(req.body.round)+1)*sLimit)
  

   var answer1="";
   for(var l=0; l<ans3.length; l++){
     answer1+=ans3[l].value
   }
 
  //console.log(parseInt(req.body.round)*sNum+" "+ ans3 +" "+ parseInt(req.body.round+1)*sNum)
  
   res.send({ans:answer1, ans2:ans4})
  
})  
  
})  
      
      
app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  if(req.query.del){
    res.redirect('/?del=1');
  }
  else{
    res.redirect('/');
  }
});
      
      
    }
})

app.get('/googleaa4089ce531efc55.html', (req,res)=>{
  res.send('google-site-verification: googleaa4089ce531efc55.html')
  
})



// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
