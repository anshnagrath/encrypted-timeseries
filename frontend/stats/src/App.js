import logo from './logo.svg';
import './App.css';
import MainStats from './componets/stats';
import Records from './componets/records';

import {Container } from 'reactstrap';
import React from 'react';
import Socket  from './ws';

export class App extends React.Component {


  render() {
 
  return (
    <React.Fragment>
          <Container fluid className="p-0">
              <MainStats socket={Socket} ></MainStats>
              <Records  socket={Socket}  ></Records>
            </Container>
      </React.Fragment>
  );
  }


  
}

export default App;
