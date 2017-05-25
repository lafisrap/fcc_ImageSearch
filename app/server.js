var express = require("express"),
		googleImages = require("./google-images");

var app = express();

const client = new googleImages("013853972238622393725:awjwxodie50", "AIzaSyAjUh9S25aqhFL2WvNYRiO9JkG0rsrnwFc");

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get( "/api/imagesearch/*", function(req, res) {

	client.search(req.params[0], { page: req.query.offset, size: "xxlarge", rights: "cc_publicdomain" }) // rights: cc_publicdomain, cc_attribute, cc_sharealike, cc_noncommercial, cc_nonderived
    .then(images => {
			res.json(images);	
    }).catch(err => {
    	res.json({})
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
