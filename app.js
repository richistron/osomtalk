/** Module dependencies **/

var express = require('express')
, http    = require('http')
, path    = require('path')
, faye    = require('faye')
, jqtpl   = require("jqtpl")
, cons    = require('consolidate');

var app = express();
var server = new faye.NodeAdapter({mount: '/faye'});

var Room = require('./public/js/room.js').Room;
var utils = require('./public/js/utils.js').utils;

var rooms = new Array();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.engine('html', cons.jqtpl);

	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');

	//app.use(express.favicon());
	//app.use(express.logger('dev'));
	app.use(express.bodyParser());
	//app.use(express.methodOverride());
	//app.use(express.cookieParser('your secret here'));
	//app.use(express.session());
	//app.use(app.router);

	app.use(require('less-middleware')({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});


app.get('/', function(req, res) {
	res.render('index');
});

app.get('/room/:id', function(req, res) {
	var id = req.params.id;
	if(id in rooms) {
		res.render('room', {room_id: id, room_name:rooms[id].name});
	} else {
		res.redirect('/');
	}
});

/** Get all the room data **/
app.get('/rooms/get/:id', function(req, res){
	var id = req.params.id;
	if ( id in rooms ) {
		res.send(rooms[id].getRoom());
	}
});

/** creates a new room and then returns the generated id. **/
app.get('/rooms/create', function(req, res){
	/** Generates an unused room id **/
	do {
		id = Utils.makeId(7);    
	} while (rooms[id] !== undefined);

	room = new Room({id:id, name:req.body.name});
	rooms.push(room);

	client.subscribe('/messages/' + id, function(message) {
		console.log('Got a message on room: ' + message.id);
	});

	console.log('Room Created: ' + id + '(' + req.body.name + ')');
	res.send({id:id});
});


server.listen(8000);
app.use(server);

client = new faye.Client('http://localhost:8000/faye');
rooms['osomtest'] = new Room({id:'osomtest', name:'OsomTalk Test, if you find this chat say hi!'}); 
rooms['osomtest'].subscribe(client);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
