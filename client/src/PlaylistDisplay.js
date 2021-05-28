import { Component } from 'react';
import { Button, Card } from 'react-bootstrap';

class PlaylistDisplay extends Component {
    render() {
        return(
            <Card className="PlaylistContent">
                <Card.Img variant="top" src={this.props.img} />
                <Card.Body>
                    <Card.Title><b>{this.props.name}</b></Card.Title>
                    <Card.Text>{this.props.description}</Card.Text>
                </Card.Body>
                <Card.Footer style={{background: 'white', border: 'white'}}>
                    <Button className="BoldText" variant="default" style={{color: 'black', background: '#66ccff'}} href={this.props.url}><b>Open in Spotify</b></Button>
                </Card.Footer>
            </Card>
        )
    }
}

export default PlaylistDisplay;