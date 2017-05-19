import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlayConfigButton } from '../widgets/play-config-button';

// const Home = () => (<h3>Home</h3>);
// export default Home;

export default class Home extends Component{
  render(){
    return(
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <PlayConfigButton playStatus={0} playSpeed={1}/>
      </div>

      )
    }
  }
