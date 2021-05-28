require("dotenv").config();
const express = require("express");
const request = require("request");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const server = express();
const retryInterval = 1800 * 1000;

var retry = null;

// SPOTIFY AUTHENTICATION
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.SECRET;
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

      if (statusCode === 401) {
        // in case of expired/malformed token, request a new one so that the user can try again
        requestSpotifyToken();
      }
      
      if (message === "Unlaunched country") {
        res.status(404).send({
          message: message
        });
      } else {
        res.status(statusCode).send({
          message: message
        });
      }
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
    if (!error && response.statusCode === 200) {
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

      if (statusCode === 401) {
        requestSpotifyToken();
      }

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

      // Need to refresh access token once it expires
      console.log("Retrieved Spotify token, refreshing in " + body.expires_in + " s");
      setInterval(requestSpotifyToken, body.expires_in * 1000);

      if (retry !== null) {
        clearInterval(retry);
      }
    } else {
      console.log("Failed to retrieve Spotify token, retrying in " + retryInterval.toString() + " ms");
      retry = setInterval(requestSpotifyToken, retryInterval);
    }
  });
}

function parseDescription(desc) {
  // some spotify descriptions have an embed link, need to check and parse out
  return desc.replace( /(<([^>]+)>)/ig, '');
}