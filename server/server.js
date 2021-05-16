require("dotenv").config();
const express = require("express");
const request = require("request");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const server = express();

// SPOTIFY AUTHENTICATION
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.SECRET;
var token = ""

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};
requestSpotifyToken();

// ROUTES

// Categories
server.get('/api/categories', cors(), (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/browse/categories?country=' + req.query.country,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.json(
        {
          categories: Object.assign({}, ...(body.categories.items.map(item => ({ [item.id]: item.name }))))
        });
    } else {
      var statusCode = body.error.status;
      var message = body.error.message;
      res.status(statusCode).send({
        message: message
      });
    }
  });
});

// Playlists
server.get('/api/playlists', cors(), (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/browse/categories/' + req.query.category + '/playlists?' + 'country=' + req.query.country  + '&limit=' + req.query.limit,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode=== 200) {
      playlistData = body.playlists.items.map(item => ({
          name: item.name,
          description: parseDescription(item.description),
          url: item.external_urls.spotify,
          img: item.images[0].url
      }));
      res.json(playlistData);
    } else {
      var statusCode = body.error.status;
      var message = body.error.message;
      res.status(statusCode).send({
        message: message
      });
    }
  });
})

server.listen(PORT, () => {
	console.log("Server listening on " + PORT);
});

// HELPERS

function requestSpotifyToken() {
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      token = body.access_token;
    } else {
      // TODO: handle retry/handling
    }
  });
}

function parseDescription(desc) {
  // some spotify descriptions have an embed link, need to check and parse out
  return desc.replace( /(<([^>]+)>)/ig, '');
}