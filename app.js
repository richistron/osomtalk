/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes')
  , user    = require('./routes/user')
  , http    = require('http')
  , path    = require('path')
  , faye    = require('faye')
  , jqtpl   = require("jqtpl")
  , cons    = require('consolidate');

var app = express();

var server = new faye.NodeAdapter({mount: '/faye'});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.engine('html', cons.jqtpl);
  
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});




app.get('/', routes.index);
app.get('/users', user.list);

server.listen(8000);
app.use(server);


client = new faye.Client('http://localhost:8000/faye');
        
client.subscribe('/messages', function(message) {
  console.log('Got a message: ' + message.text);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
