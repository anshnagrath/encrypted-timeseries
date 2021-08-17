import React, { Component, Fragment } from 'react';

import {
  Col, Container, Row,
  Input,
  Button,
  Fade,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';


export default class MainStats extends Component {
  state = {
      fade : false,
      eventType:'',
      startbutton : false,
      sucessRate : 0,
      transmittionRate: 0,
  }

  constructor(props){
        super(props)
    if (window.performance) {
        this.props.socket.emit('server_stop');
      
    }
  }


  componentDidMount (){
     this.props.socket.on('refresh',this.processData);
 }

 processData = (allStats)=>{

   const { payload : { stats } } = allStats;
  let sucessRate = ( stats.totaldecodedStats / stats.totalrecievedStats ).toFixed(2) * 100;
  let transmittionRate = (parseFloat(stats.transmissonsize['$numberDecimal']) / 60 ).toFixed(4) * 100;
  this.setState({sucessRate  : sucessRate.toString() + ' %'  ,transmittionRate : transmittionRate.toString() + ' MB/S'   });
 }

render(){
    const emitEvent = this.props.emitter;
    return (
             <React.Fragment> 
              <Container>
             <Row>
                 <Col md={12} sm={12} className="mt-10" >
                     <div>
                     <InputGroup>
                     <InputGroupAddon addonType="prepend">
                               <InputGroupText>Transmition Rate :</InputGroupText>
                     </InputGroupAddon>
                             <Input placeholder="0" disabled value={this.state.transmittionRate} />
                      </InputGroup>
                    </div>        
                    <div className="mt-10" >
                      <InputGroup>
                     <InputGroupAddon addonType="prepend">
                               <InputGroupText>Decode Rate :</InputGroupText>
                     </InputGroupAddon>
                             <Input placeholder="0" disabled  value={this.state.sucessRate}/>
                      </InputGroup>  

                    </div>    
      
                 </Col>
            </Row>   


            <Row className="mt-10" >
                 <Col md= {{ size: 'auto', offset:3 }} sm={6} >
                 
                     <Button outline color="danger" onClick={()=> this.checkEvent('server_start')  }  disabled={this.state.startbutton}> Start Server</Button>
                
                 </Col>

                 <Col md={{ size: 'auto', offset:3}} sm={6} >
                 
                      <Button outline color="primary" onClick={()=>  this.checkEvent('server_stop')     } >Stop Server</Button>

                 </Col>
        
            </Row> 

             <Row className="mt-10" > 
                <Col md={12}  sm={{ size :12 }} className="text-center" >
                    <Fade in={this.state.fade} tag="h5" className="mt-3">
                         { this.state.eventType == 'server_start' ?  'Server Started Please Wait For 10 sec you will soon see realtime records' : this.state.eventType == 'server_stop' ? 'Stopping Server Now' : '' }
                     </Fade>
                </Col>
             </Row> 

             </Container>  


             </React.Fragment>
            
            )

}

checkEvent = (event )=>{

  this.props.socket.emit(event);
  this.setState( { eventType : event , fade : true , startbutton:true } );
  setTimeout(()=>{ 
     let disableStartButon = true
      if(event == 'server_stop') disableStartButon = false;
     this.setState( { eventType : '' , fade : false ,startbutton: disableStartButon } );
     },11000)

}






}