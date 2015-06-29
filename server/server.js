var express = require('express');
var bodyParser = require('body-parser');

var connectionString = process.env.MONGODB || 'mongodb://localhost/roads';
var db = require('monk')(connectionString);

var app = express();

app.use(bodyParser.json());

app.get('/maps', function(req, res){
  var maps = db.get('maps');
  var allMaps = {};
  maps.find({}, function(err, docs) {
    docs.forEach(function(doc) {
      if(allMaps[doc.name]){
        allMaps[doc.name].push(doc.datestamp);
      } else {
        allMaps[doc.name] = [doc.datestamp];
      }
    });

    res.set('Content-Type', 'application/json');
    res.json(allMaps);
  });
});

app.get('/map/:name', function(req, res){
  var maps = db.get('maps');
  maps.findOne({$query: {name: req.params.name}, $orderby:{datestamp: -1}}, function(err, doc){
  
    if(doc) {
      res.set('Content-Type', 'application/json');
      res.json(doc.map);
    } else {
      res.status(400).json({error:"No map with this name found"});
    }
  });
});


app.put('/map/:name', function(req, res) {
  var maps = db.get('maps');

  var mongoMap = {
    map: req.body,
    name: req.params.name,
    datestamp: Date.now()
  };

  maps.insert(mongoMap, function (err, doc) {
    if(err) {
      res.satus(400).json({error: 'could not insert map', reason: err});
    } else {
      res.send('Done');
    }
  });
 
  
});

app.use(express.static('.'));

app.use(function (req, res) {
  res.status(405).json({error:"No routes found matching path and verb"});
})


app.listen(8009);
