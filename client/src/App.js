import './App.css';
import PlaylistForm from './PlaylistForm';
import { Component } from 'react';

const request = require('request');

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    // TODO
  }

  render() {
    return (
      <div>
        <div>
          <h1>Playlist Worldwide</h1>
          <h3>Search for featured playlists around the world!</h3>
        </div>
        <PlaylistForm />
      </div>
    );
  }
}

export default App;
