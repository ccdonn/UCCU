exports.general = function(req, res) {
  res.send({
    status:"_OK",
    time: new Date().getTime()
  });
}
