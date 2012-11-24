
/*
 * Channel Routes
 */

exports.new = function(req, res){
  res.send("respond with a resource");
};

exports.view = function(req, res){
  var id = req.params.id;
  res.render('room', {room: id});
};