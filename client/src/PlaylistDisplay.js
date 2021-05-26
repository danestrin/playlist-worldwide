import { Component } from 'react';
import { Button, Card } from 'react-bootstrap';

class PlaylistDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Card className="PlaylistContent">
                <Card.Img variant="top" src={this.props.img} />
                <Card.Body>
                    <Card.Title className="BoldText">{this.props.name}</Card.Title>
                    <Card.Text>{this.props.description}</Card.Text>
                </Card.Body>
                <Card.Footer style={{background: 'white', border: 'white'}}>
                    <Button className="BoldText" variant="default" style={{color: 'black', background: '#66ccff'}} href={this.props.url}>Open in Spotify</Button>
                </Card.Footer>
            </Card>
        )
    }
}

export default PlaylistDisplay;