import { Component } from 'react';
import { Form, Button, Container, Col, Row, Alert, Spinner, } from 'react-bootstrap';
import PlaylistDisplay from './PlaylistDisplay';

const request = require('request');
const countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const api_url = process.env.REACT_APP_API_URL;

const limit = 12;

const errors = {
    "400": "Looks like an issue on our end.",
    "401": "Had trouble reaching Spotify data - please try again.",
    "404-country": "Couldn't find Spotify data for the selected country - please try another one.",
    "404-category": "Couldn't find Spotify data for the selected category - please try another one.",
    "server-down": "Could not connect to the Playlist Worldwide server.",
    "no-data": "Had trouble loading playlists - please try again.",
    "unknown": "Not sure what went wrong.",
}

class PlaylistForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countriesMap: countries.getNames("en"),
            categoriesMap: {},
            country: "",
            category: "",
            playlists: [],
            error: "",
            loading: false
        }
    }

    render() {
        return(
            <div>
                <Form className="PlaylistForm">
                    {
                        this.state.error !== "" &&
                        <Alert key="error" variant="danger"> 
                            <Alert.Heading style={{ fontFamily: 'Noto Sans JP' }}>Sorry about that!</Alert.Heading>
                            <p style={{ fontFamily: 'Noto Sans JP' }}>{this.state.error}</p>
                        </Alert>
                    }
                    {
                        this.state.loading &&
                        <div className="SpinnerWrapper">
                            <Spinner className="Spinner" animation="border"/>
                        </div>
                    }
                    <Form.Group className="Select" value={this.state.country} onChange={(e) => this.fetchMusicCategoriesForCountry(e)}>
                        <Form.Control as="select" defaultValue="">
                            <option disabled value="">Select a country...</option>
                            {
                                Object.keys(this.state.countriesMap).map((k, i) => {
                                    return(<option value={k} key={k}>{this.state.countriesMap[k]}</option>)
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    {
                        <div className={((this.isCountrySelected() && this.isCategorySelected()) ? "FadeIn" : "Hidden")}>
                            <Form.Group className="Select">
                                <Form.Control as="select" value={this.state.category} onChange={(e) => this.updateCategory(e)}>
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
                <Container className={(this.arePlaylistsShowing() ? "PlaylistCards FadeIn" : "Hidden")}>
                    <Row>
                    {
                        this.state.playlists.map((playlist) => {
                            return (
                                <Col key={playlist.url} className="CardCol">
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
        var options = {
            url: api_url + "/api/categories?country=" + event.target.value
        };

        this.setState(prevState => ({
            countriesMap: prevState.countriesMap,
            categoriesMap: prevState.categoriesMap,
            country: prevState.country,
            category: prevState.category,
            playlists: prevState.playlists,
            error: "",
            loading: true
        }));

        request.get(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                this.setState(prevState => ({
                    countriesMap: prevState.countriesMap,
                    categoriesMap: data.categories,
                    country: event.target.value,
                    category: Object.keys(data.categories)[0],
                    playlists: prevState.playlists,
                    error: "",
                    loading: false
                }));
            } else {
                if (response === undefined) {
                    this.setState(prevState => ({
                        countriesMap: prevState.countriesMap,
                        categoriesMap: {},
                        country: event.target.value,
                        category: "",
                        playlists: [],
                        error: errors["server-down"],
                        loading: false
                    }))
                } else {
                    var errorKey = response.statusCode === 404 ? "404-country" : response.statusCode.toString();
                    this.setState(prevState => ({
                        countriesMap: prevState.countriesMap,
                        categoriesMap: {},
                        country: event.target.value,
                        category: "",
                        playlists: [],
                        error: (errorKey in errors) ? errors[errorKey] : errors["unknown"],
                        loading: false
                    }));
                }
            }
        });
    }

    updateCategory(event) {
        this.setState(prevState => ({
            countriesMap: prevState.countriesMap,
            categoriesMap: prevState.categoriesMap,
            country: prevState.country,
            category: event.target.value,
            playlists: prevState.playlists,
            error: "",
            loading: false
        }));
    }

    fetchPlaylists(event) {
        var options = {
            url: api_url + "/api/playlists?category=" + this.state.category + "&country=" + this.state.country + "&limit=" + limit
        };

        this.setState(prevState => ({
            countriesMap: prevState.countriesMap,
            categoriesMap: prevState.categoriesMap,
            country: prevState.country,
            category: prevState.category,
            playlists: prevState.playlists,
            error: "",
            loading: true
        }));

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

                // noticed a weird issue where sometimes a request would return an empty body, refreshing usually fixes it
                if (playlists.length === 0) {
                    this.setState(prevState => ({
                        countriesMap: prevState.countriesMap,
                        categoriesMap: prevState.categoriesMap,
                        country: prevState.country,
                        category: prevState.category,
                        playlists: playlists,
                        error: errors["no-data"],
                        loading: false
                    }));
                } else {
                    this.setState(prevState => ({
                        countriesMap: prevState.countriesMap,
                        categoriesMap: prevState.categoriesMap,
                        country: prevState.country,
                        category: prevState.category,
                        playlists: playlists,
                        error: "",
                        loading: false
                    }));
                }
            } else {
                if (response === undefined) {
                    this.setState(prevState => ({
                        countriesMap: prevState.countriesMap,
                        categoriesMap: {},
                        country: event.target.value,
                        category: "",
                        playlists: [],
                        error: errors["server-down"],
                        loading: false
                    }))
                } else {
                    var errorKey = response.statusCode === 404 ? "404-category" : response.statusCode.toString();
                    this.setState(prevState => ({
                        countriesMap: prevState.countriesMap,
                        categoriesMap: prevState.categoriesMap,
                        country: prevState.country,
                        category: prevState.category,
                        playlists: [],
                        error: (errorKey in errors) ? errors[errorKey] : errors["unknown"],
                        loading: false
                    }))
                }
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