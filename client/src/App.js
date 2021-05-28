import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlaylistForm from './PlaylistForm';
import { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Wrapper">
          <div className="Title">
            <h1>Playlist Worldwide</h1>
            <h3>Search for featured playlists around the world!</h3>
          </div>
          <PlaylistForm />
        </div>
        <div className="Footer">
          <a className="FooterLink" href="https://github.com/danestrin/playlist-worldwide">Source Code on Github</a>
        </div>
      </div>
    );
  }
}

export default App;
