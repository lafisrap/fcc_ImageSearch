var express = require("express"),
//		googleImages = require("./google-images");
    Flickr = require('flickr-sdk');

var flickr = new Flickr({
  "apiKey":            "c21fb0fb585620da8cee458229fab01a",
  "apiSecret":         "c5dc295bb3f7b823",
});

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var searchTerms = [];

app.get( "/api/imagesearch/*", function(req, res) {
  var searchTerm = req.params[0];

  flickr
    .request()
    .media()
    .search(searchTerm)
    .get({
        media: 'photos', // Only photos, no videos
        sort: 'date-taken-desc', // Ordered by most recently taken photos)
        page: parseInt(req.query.page) || 1,
        per_page: 20,
        license: "1"
    })
    .then(data => {
      var {page, pages, perpage, total, photo} = data.body.photos;

      if( searchTerms.indexOf(searchTerm) === -1 ) {
        searchTerms.unshift(searchTerm);
        searchTerms = searchTerms.slice(0,20);
      }

      res.json( {

        page,
        pages,
        perpage,
        total,
        images: photo.map( image => {
          return {
            title: image.title,
            url: "https://farm"+image.farm+".staticflickr.com/"+image.server+"/"+image.id+"_"+image.secret+".jpg",
            source: "http://flickr.com/photo.gne?id="+image.id
          }
        })
      });
    }).catch(err => {
      console.error( err );
      res.json({})
    });
});

app.get( "/api/searchterms", function(req, res) {
  res.json(searchTerms);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
