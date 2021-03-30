import React, { Component } from 'react';
import dateFormat from 'dateformat';
import {Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      output: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.convertText = this.convertText.bind(this);
    this.convertSong = this.convertSong.bind(this);
    this.convertTime = this.convertTime.bind(this);
  }
  handleChange(event) {
    this.setState({input: event.target.value})
  }
  
  //timestamp in format 2016-01-26 15:35:55

  convertTime(unixTime) {
    const date = new Date(unixTime * 1000);
    return dateFormat(date, "yyyy-mm-dd hh:mm:ss");
  }

  convertSong(song) {
    //massive kudos to Jesselnik for explanation of this https://github.com/Jeselnik/rb-scrobbler
    const songArray = song.split(/\t/g);
    if(songArray[5] === "S") { //if track was skipped
      return "";
    }
    const artist = "\"" + songArray[0] + "\"";
    const track = "\"" + songArray[2] + "\"";
    const album = "\"" + songArray[1] + "\"";
    const timestamp = "\"" + this.convertTime(songArray[6]) + "\"";
    //duration in seconds 
    const duration = "\"" + songArray[4] + "\"";
    return(artist + ", " + track + ", " +  album + ", "  + timestamp + ", \"\" , " + duration)
    

  }
  convertText() {
    const songsArray = this.state.input.split(/\n/g);
    let finalString = "";
    let i;
    for(i = 0; i < songsArray.length; i++) {
      const currentSong = this.convertSong(String(songsArray[i]));
      if(currentSong !== "") {
        finalString = finalString + "\n" + this.convertSong(String(songsArray[i]));
      } 
    }
    this.setState({output: finalString})
  }
 

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
            <br></br>
        <p>Hello, I built this for my own purposes + wanted to get it up quickly so it's ugly/low functionality. Ideas for the future:</p>
        <ul>
          <li>redo styling/make everything look pretty / more usable </li>
          <li>allow it to accept full .scrobbler.log / make it less finicky with newline and where it begins</li>
          <li>direct last.fm API integration / no reliance on universal scrobbler </li>
        </ul>
        <p>Please <a href="mailto:lucas_gelfond@brown.edu">email me</a> or add an issue/pull request the <a href="https://github.com/lucasgelfond/react-rockbox-scrobbler">repo</a> if you have notes</p>
        <p>Instructions: Copy/paste the text below the #CLIENT line in .scrobbler.log; do not include the newline at the end of the file in your selection. Paste the output into the "Scrobble Manually in Bulk" box on UniversalScrobbler.</p>
        <h1>Text inputted from .scrobbler.log</h1>
        <textarea onChange={this.handleChange}></textarea>
        <br></br>
        <Button variant="primary" size="sm" onClick={this.convertText}>Convert to Universal Scrobbler text</Button>
        <br></br>
        <br></br>
        <h1>Text for the Universal Scrobbler</h1>
        <pre>{this.state.output}</pre>
        </Col>
        </Row>
        </Container>
      </div>
    )
  }
}

export default App
