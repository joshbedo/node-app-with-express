
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
  app.use(app.router);
  app.use(express.static(__dirname + "/public"));
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
