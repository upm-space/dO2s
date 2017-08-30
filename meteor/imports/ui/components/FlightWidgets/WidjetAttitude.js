import React from 'react';
import PropTypes from 'prop-types';
import './FlightWidgets.scss';

const WidjetAttitude= ({instSize,pitchProp,rollProp}) => (
    <div className="instrument" style={{height: instSize + 'vh', width:instSize + 'vh', maxHeight: $(window).innerWidth()*5/37, maxWidth: $(window).innerWidth()*5/37}}>
        <div>
            <img src="/img/svg/horizon_back.svg"  />
        </div>
        <div>
            <img src="/img/svg/horizon_ball.svg"
                 style={{top: drawPtich(pitchProp)+'%', transform:'rotate('+ rollProp +'deg)'}}/>/>
        </div>
        <div>
            <img src="/img/svg/horizon_circle.svg"  style={{transform:'rotate('+ rollProp +'deg)'}}/>
        </div>
        <div>
            <img src="/img/svg/horizon_mechanics.svg"  />
            <img src="/img/svg/fi_circle.svg" />
        </div>
    </div>
);

const drawPtich = (pitch) => {
    let pitch_bound = 25;
    if(pitch>pitch_bound){pitch = pitch_bound;}
    else if(pitch<-pitch_bound){pitch = -pitch_bound;}
    pitch = pitch*0.7;
    return pitch
}

WidjetAttitude.prototypes = {
    instSize: PropTypes.string.isRequired,
    pitchProp: PropTypes.number.isRequired,
    rollProp: PropTypes.number.isRequired
}

export default WidjetAttitude;