import React from 'react';
import PropTypes from 'prop-types';

export class PlayConfigButton extends React.Component{
  constructor(props){ //instanciar la clase convertir la idea en objeto "real", crear un objeto
    super(props);
  }

  render(){ // método
    let playStatus = this.props.playStatus; // -1 reverse, 0 pause, 1 play
    let playSpeed = this.props.playSpeed;
    var squarePos;

    if (playSpeed == -1) {
      squarePos = 5;
    } else if (playSpeed == 0) {
      squarePos = 105;
    } else {
      squarePos = 205;
    }

    // ¿Cómo consigo que el click del botón active la animación en JSX?

    return(
      <div className="play config button">
          <p style={{display: 'flex', justifyContent: 'center'}}>
            <font color="grey"><b><em>¡En pruebas!</em></b></font>
          </p>
          <svg width="300" height="160">
              <rect width="300" height="160" fill="silver" stroke="black" strokeWidth=".5"/>
              <rect width="300" height="25" fill="grey" stroke="black" strokeWidth=".5"/>

              <svg className="speed"
                   width="300" height="25" x="0" y="0"
                   viewBox="0 0 120 10">
                  <defs>
                      <line id="mainLine" y1="2" y2="10" strokeWidth="0.5" stroke="black"/>
                      <line id="subLine" y1="4" y2="10" strokeWidth="0.5" stroke="black" strokeOpacity="0.5"/>
                      <path id="speedDial" fill="red" fillOpacity="0.7"
                            d="M0.5 4.5 L0 5 L6 5 L5.5 4.5 L4 4 L4 1 L3 -2 L2 1 L2 4 Z" transform="translate(-3 -5)"/>
                  </defs>
              </svg>

              <rect width="300" height="100" y="25" fill="darkgrey" stroke="black" strokeWidth=".5"/>

              <svg className="selection"
                   width="300" height="100" x="0" y="25"
                   viewBox="0 0 300 100">
                  <rect width="90" height="90" x={squarePos} y="5" fill="dimgrey">
                      <animate id="toBack"
                               attributeName="x" to="5"
                               begin="backward.click" dur="0.1s" keySplines=".4 0 1 1" fill="freeze"/>
                      <animate id="toPause"
                               attributeName="x"
                               to="105"
                               begin="playPause.click" dur="0.1s" keySplines=".4 0 1 1" fill="freeze"/>
                      <animate id="toForward"
                               attributeName="x"
                               to="205"
                               begin="forward.click" dur="0.1s" keySplines=".4 0 1 1" fill="freeze"/>
                  </rect>
              </svg>

              <svg className="backward" id="backward"
                   width="100" height="100" x="0" y="25" viewBox="0 0 36 36">
                   <path id="backwardPath"
                            d="M 11 18 L 26 26 L 26 10"/>
                  <rect width="18" height="18" x="9" y="9" fill="transparent"/>
              </svg>
              <svg className="playPause" id="playPause"
                   width="100" height="100" x="100" y="25" viewBox="0 0 36 36">
                  <path id="playPausePath"
                            d="M11 10 L17 10 L17 26 L11 26 M20 10 L26 10 L26 26 L20 26 Z"/>
                  <rect width="18" height="18" x="9" y="9" fill="transparent"/>
              </svg>
              <svg className="forward" id="forward"
                   width="100" height="100" x="200" y="25" viewBox="0 0 36 36">
                  <path id="forwardPath"
                            d="M11 10 L11 26 L26 18 Z"/>
                  <rect width="18" height="18" x="9" y="9" fill="transparent"/>
              </svg>

              <svg className="textHub"
                   width="300" height="35" y="125" viewBox="0 0 300 35">
                  <text x="150" y="17.5" textAnchor="middle"
                        fontSize="75%" fontFamily="Verdana" fontWeight="bold" fill="black">
                      <tspan id="fechaTextHub" alignmentBaseline="central">Mar. 16 Mayo 2017 - </tspan><tspan id="horaTextHub" alignmentBaseline="central">11:00:00 UTC</tspan>
                  </text>
              </svg>
          </svg>
      </div>
    )
    }
}

PlayConfigButton.propTypes = {
  playStatus : PropTypes.number.isRequired,
  playSpeed  : PropTypes.number.isRequired
}

PlayConfigButton.defaultProps = {
  playStatus : 1,
  playSpeed  : 1
}
