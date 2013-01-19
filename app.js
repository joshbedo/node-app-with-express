
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.set('view cache', true);

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'this is a secret'}));
  app.use(app.router);
  app.use(express.static(__dirname + "/public"));
});

app.get('/name/:name', function(req, res){
  req.session.name = req.params.name;
  res.send('session stored');
  //res.cookie('name', req.params.name).send('<p>go here</p>');
});

app.get('/name', function(req, res){
  res.send(req.session.name);
});

app.get('/delete', function(req, res){
  res.clearCookie('name').send('deleted');
});

app.get("/", function(req, res){
  //res.send(req.acceptsCharset('uft-8') ? 'yes' : 'no');
  //res.send(req.acceptsLanguage('fr') ? 'yes' : 'no');
  //res.send(404, "not found");
  res.format({
    html: function(){ res.send("<h1> Body</h1>"); },
    json: function(){ res.json({ message: "body"}); },
    text: function(){ res.send("body"); }
  });

 //res.json({ message: "some message here"});
  res.render('home', { title: "Building web apps for fun in Node with Express" });
});

app.param('from', function(req, res, next, from){
  req.from = parseInt(from, 10);
  //next basically passes it down to the next middleware layer
  next();
});

app.param('to', function(req, res, next, to){
  req.to = parseInt(to, 10);
  //next basically passes it down to the next middleware layer
  next();
});

var pages = ['Page 0', 'Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 6', 'Page 7'];

app.get('/pages/:from-:to', function(req, res){
  /*var from = parseInt(req.params.from, 10);
      to   = parseInt(req.params.to, 10);*/

  res.json(pages.slice(req.from, req.to + 1));
});

var count = 0;

app.get('/hello.txt', function(req, res, next){

  //counts times file has been downloaded/viewed
  count++;
  next();
});

app.get("/count", function(req, res){
  res.send(count.toString());
});


app.get("/home", function(req, res){
  //302 is default but just showing you can pass a status code param
  //res.status(302).redirect('/');
  res.redirect(302, '/');
});

app.get("/name/:name?", function(req, res){
  //res.send(req.params.name);
  res.send(req.param('name', 'default value'));
});

app.get("/users/:userId", function(req, res){
  res.send("Hello, User #" + req.params.userId);
});

app.post("/createuser", function(req, res){
  res.send("creating user:");
});

app.get(/\/users\/(\d*)\/?(edit)?/, function(req, res){
  var message = "user #" + req.params[0] + "'s profile";

  if(req.params[1] === 'edit'){
    message = "Editing " + message;
  }else{
    message = "Viewing " + message;
  }
  res.send(message);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
