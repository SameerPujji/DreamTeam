var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session')
var LocalStrategy = require('passport-local');
var User = require('./models.js').User;
var Problems = require('./models.js').Problems;

mongoose.connect(process.env.MONGODB_URI);

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(session({
  secret: 'secretsauce'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log(err);
      return done(err);
    }
    // if no user present, auth failed
    if (!user) {
      console.log(user);
      return done(null, false);
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      return done(null, false);
    }
    // auth has has succeeded
    return done(null, user);
  });
}));
app.use(passport.initialize());
app.use(passport.session());




app.get('/', function(req,res)
{
  res.render('main')
})

app.get('/login', function(req,res){
  res.render('login')
})

app.post('/login', passport.authenticate('local',{

successRedirect : '/problems',
faliureRedirect: '/'
})

  //authenticating for jasmeher
  //will check if uname = jassi and password = Sam33rIsAmazing#
)

app.get('/problems', function(req,res){
if(req.user)
{
  Problems.find({}, function(err,succ){

      res.render('problems', {
        things: succ
      })
  })
}else {
  console.log("NOT FINDING USER ", req.user)
  res.send("access denied")
}


})

app.get('/about', function(req,res)
{
  res.render('about')
})

app.post('/complain', function(req,res){

    var newComp = new Problems({
      name: req.body.sName,
      class: req.body.sClass,
      email: req.body.email,
      problem: req.body.comment

    })

    newComp.save(function(err,succ){
      if(succ)
      {
        res.redirect('/')
      }else {
        res.status(500)
      }
    })
})


app.listen(process.env.PORT || 3000)
