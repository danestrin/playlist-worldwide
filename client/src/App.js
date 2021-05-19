import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlaylistForm from './PlaylistForm';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    document.body.style = 'background: #666699'
  }

  render() {
    return (
      <div>
        <div className="Title">
          <h1>Playlist Worldwide</h1>
          <h3>Search for featured playlists around the world!</h3>
        </div>
        <PlaylistForm />
      </div>
    );
  }
}

export default App;
