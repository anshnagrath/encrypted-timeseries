import React, { Component, Fragment } from 'react';

import {
   ListGroup,List ,Container, Row,Col
} from 'reactstrap';


export default class Records extends Component {
state = {
   data : []
}

  constructor(props) {
    super(props);

  }

  componentDidMount() {
      this.props.socket.on('refresh',this.processData)
  }

  processData = ( allRec )=>{
     const { payload:{data}}  = allRec;   
     let allUpdatedRec =  [ data , ...this.state.data];
     this.setState({ data : allUpdatedRec})

  }


    render(){
        return(
              <>
                <Container>
                  <Row className="mt-10">
                      <Col md={12}>
                         <List type="unstyled">
                          {  this.state.data.map(( obj ) => { 
                               return  ( <li>
                                  <div className="text-center">
                                 <li>Decode Date : { obj.day } </li> 
                                  <li>Decode Time : { obj.time } </li> 
                                  <li>Number of Samples : { obj.samples } </li> 
                                  </div>
                                  {

                                    obj.data.map((d)=>{
                                    return ( 
                                       <li  className="mt-10"> 
                                        <ul> Name : { d.name}</ul>     
                                        <ul> Origin: { d.origin} </ul>     
                                        <ul> Destination: {d.destination}</ul>     
                                       </li>
                                     )
                                    })                                     
                                  }

                                 </li> )
                          })
                          
                          
                          }

                         </List> 
                      </Col>  
                    </Row>
                  </Container>        
        
               </>
         
         
         )
    }

}