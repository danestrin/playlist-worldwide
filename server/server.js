require("dotenv").config();
const express = require("express");
const request = require("request");
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
server.get('/api/categories', (req, res) => {
  res.json({ token: token });
  // TODO
});

// Playlists
server.get('/api/playlists', (req, res) => {
  // TODO
})

server.listen(PORT, () => {
	console.log("Server listening on " + PORT);
});

function requestSpotifyToken() {
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      token = body.access_token;
    } else {
      // TODO: handle retry/handling
    }
  });
}