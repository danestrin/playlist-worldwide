import { Component } from 'react';
import { Button, Card, Image } from 'react-bootstrap';

class PlaylistDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Card>
                <Card.Img variant="top" src={this.props.img} />
                <Card.Body>
                    <Card.Title>{this.props.name}</Card.Title>
                    <Card.Text>{this.props.description}</Card.Text>
                    <Button variant="default" href={this.props.url}>Open in Spotify</Button>
                </Card.Body>
            </Card>
        )
    }
}

export default PlaylistDisplay;