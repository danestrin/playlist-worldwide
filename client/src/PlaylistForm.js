import { Component } from 'react';
import { Form, Button, Container, Col, Row, CardDeck } from 'react-bootstrap';
import PlaylistDisplay from './PlaylistDisplay';

const request = require('request');
const countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const limit = 4;

class PlaylistForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countriesMap: countries.getNames("en"),
            categoriesMap: {},
            country: "",
            category: "",
            playlists: []
        }
    }

    render() {
        return(
            <div>
                <Form className="PlaylistForm">
                    <Form.Group className="Select" controlId="countrySelect" value={this.state.country} onChange={(e) => this.fetchMusicCategoriesForCountry(e)}>
                        <Form.Control className="Select" as="select" defaultValue="">
                            <option disabled value="">Select a country...</option>
                            {
                                Object.keys(this.state.countriesMap).map((k, i) => {
                                    return(<option value={k} key={k}>{this.state.countriesMap[k]}</option>)
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    {
                        <div className={((this.isCountrySelected() && this.isCategorySelected()) ? "FadeIn" : "FadeOut")}>
                            <Form.Group className="Select" controlId="categorySelect" onChange={(e) => this.updateCategory(e)}>
                                <Form.Control className="Select" as="select">
                                    {
                                        Object.keys(this.state.categoriesMap).map((k, i) => {
                                            return (<option value={k} key={k}>{this.state.categoriesMap[k]}</option>)
                                        })
                                    }
                            </Form.Control>
                            </Form.Group>
                            <Form.Group className="ButtonWrapper">
                                <Button variant="default" style={{color: 'black', background: '#66ccff'}} size="lg" onClick={(e) => this.fetchPlaylists(e)}>Find playlists</Button>
                            </Form.Group>
                        </div>
                    }
                </Form>
                    <Container className={(this.arePlaylistsShowing() ? "PlaylistCards FadeIn" : "FadeOut")}>
                        <Row>
                        {
                            this.state.playlists.map((playlist) => {
                                return (
                                    <Col className="CardCol">
                                        <PlaylistDisplay key={playlist.url} name={playlist.name} description={playlist.description} url={playlist.url} img={playlist.img}/>
                                    </Col>
                                )
                            })
                        }
                        </Row>
                    </Container>
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
                    category: Object.keys(data.categories)[0],    // bit hacky, first option gets selected first in the UI
                    playlists: prevState.playlists
                }));
            } else {
                this.setState(prevState => ({
                    countriesMap: prevState.countriesMap,
                    categoriesMap: {},
                    country: event.target.value,
                    category: "",
                    playlists: []
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
            playlists: prevState.playlists
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
                var playlists = data.map((playlist) => {
                    return {
                        name: playlist.name,
                        description: playlist.description,
                        url: playlist.url,
                        img: playlist.img
                    };
                });

                this.setState(prevState => ({
                    countriesMap: prevState.countriesMap,
                    categoriesMap: prevState.categoriesMap,
                    country: prevState.country,
                    category: prevState.category,
                    playlists: playlists
                }));
            } else {
                // TODO: error badge/message
            }
        });
    }

    isCountrySelected() {
        return this.state.country !== "";
    }

    isCategorySelected() {
        return this.state.category !== "";
    }

    arePlaylistsShowing() {
        return this.state.playlists.length !== 0;
    }
}

export default PlaylistForm;