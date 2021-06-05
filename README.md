# Playlist Worldwide  
## A full-stack Node & React web app utilizing Spotify's Dev API

Playlist Worldwide is a web application that allow users to find official international playlists provided by Spotify. It features a simple yet elegant UI, and asks for a country and genre (which vary by country, determined by Spotify) and provides the user with up to 12 playlists which can be opened in the Spotify Web Player. The app utilizes the Client Credentials authorization flow, so no sign-in is required with a Spotify account and only public Spotify data is returned. The app is hosted on Heroku.

[Check it out!](https://playlist-worldwide.herokuapp.com/)

## Gallery
(Some screenshots on my laptop & desktop)
![pw1](https://user-images.githubusercontent.com/5817401/120725839-abfe4c80-c48b-11eb-835e-ca636d1249b8.png)
![pw2](https://user-images.githubusercontent.com/5817401/120725876-bae4ff00-c48b-11eb-95d1-7fbb927f3953.png)
![pw3](https://user-images.githubusercontent.com/5817401/120725902-c6d0c100-c48b-11eb-80d7-58a8b204eaaa.png)

## Known issues & possible extensions
- All the data is provided directly via Spotify's Dev API. Not all playlists returned per country will be exclusive to that country or that country's language - some countries will return playlists belonging to other countries - some might even exlusively return English playlists. I tried to mitigate this as much as possible by returning multiple playlists, so that there will be a variety of different language playlists returned.
- The website works on mobile, but the formatting/CSS is off compared to the non-mobile web version that the app was intended for - I'll potentially look into extending the app to have proper formatting on mobile browsers as well. (Workaround: Enabling "Desktop site" setting on mobile fixes the formatting on mobile)
- I did my best to handle any sort of error requests that may arise in the UI (country not having Spotify support, possible authorization expiration, etc) but please let me know in the issues if I missed any!
