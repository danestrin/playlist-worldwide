import { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import PlaylistDisplay from './PlaylistDisplay';

const request = require('request');
const countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const limit = 1;    // playlists to return

class PlaylistForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countriesMap: countries.getNames("en"),
            categoriesMap: {},
            country: "",
            category: "",
            playlist: {}
        }
    }

    render() {
        return(
            <div>
                <Form>
                    <Form.Group controlId="countrySelect" value={this.state.country} onChange={(e) => this.fetchMusicCategoriesForCountry(e)}>
                        <Form.Control as="select" defaultValue="">
                            <option value="">Select a country...</option>
                            {
                                Object.keys(this.state.countriesMap).map((k, i) => {
                                    return(<option value={k} key={k}>{this.state.countriesMap[k]}</option>)
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="categorySelect" onChange={(e) => this.updateCategory(e)}>
                        <Form.Control as="select">
                            {
                                Object.keys(this.state.categoriesMap).map((k, i) => {
                                    return (<option value={k} key={k}>{this.state.categoriesMap[k]}</option>)
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Button variant="default" size="lg" onClick={(e) => this.fetchPlaylists(e)}>Find playlists</Button>
                    </Form.Group>
                </Form>
                <div>
                    <PlaylistDisplay name={this.state.playlist.name} description={this.state.playlist.description} url={this.state.playlist.url} img={this.state.playlist.img}/>
                </div>
            </div>
        );
    }

    fetchMusicCategoriesForCountry(event) {
        var host = process.env.REACT_APP_DEV_API_HOST
        var port = process.env.REACT_APP_DEV_API_PORT
        var options = {
            url: host + ":" + port + "/api/categories?country=" + event.target.value
        };

        request.get(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                this.setState(prevState => ({
                    countriesMap: prevState.countriesMap,
                    categoriesMap: data.categories,
                    country: event.target.value,
                    category: data[Object.keys(data.categories)[0]],    // bit hacky, first option gets selected first in the UI
                    playlist: prevState.playlist
                }));
            } else {
                console.log(response);
                this.setState(prevState => ({
                    countriesMap: prevState.countriesMap,
                    categoriesMap: {},
                    country: event.target.value,
                    category: "",
                    playlist: {}
                }))
                // TODO: error alert/badge
            }
        });
    }

    updateCategory(event) {
        this.setState(prevState => ({
            countriesMap: prevState.countriesMap,
            categoriesMap: prevState.categoriesMap,
            country: prevState.country,
            category: event.target.value,
            playlist: prevState.playlist
        }));
    }

    fetchPlaylists(event) {
        var host = process.env.REACT_APP_DEV_API_HOST
        var port = process.env.REACT_APP_DEV_API_PORT
        var options = {
            url: host + ":" + port + "/api/playlists?category=" + this.state.category + "&country=" + this.state.country + "&limit=" + limit
        };

        request.get(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                var playlist = data[0]
                this.setState(prevState => ({
                    countriesMap: prevState.countriesMap,
                    categoriesMap: prevState.categoriesMap,
                    country: prevState.country,
                    category: event.target.value,
                    playlist: {
                        name: playlist.name,
                        description: playlist.description,
                        url: playlist.url,
                        img: playlist.img
                    }
                }));
            } else {
                // TODO: error badge/message
            }
        });
    }
}

export default PlaylistForm;