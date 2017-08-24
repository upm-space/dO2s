import React from 'react';
import PropTypes from 'prop-types';
import './WidgetAirSpeed.scss';

const WidjetAirSpeed = ({instSize,speedProp}) => (
    <div className="instrument" style={{height: instSize + 'vh', width: instSize + 'vh', maxHeight: $(window).innerWidth()*5/10, maxWidth: $(window).innerWidth()*5/10}} >
        <div>
            <img src="/img/svg/speed_mechanics.svg"  />
        </div>
        <div>
            <img id="speedControl" src="/img/svg/fi_needle.svg" style={{transform:'rotate(' + draw(speedProp) +')'}}/>
        </div>
        <div>
            <img src="/img/svg/fi_circle.svg" />
        </div>
    </div>
);

const draw = (speed) =>{
    let airspeed_bound_l = 0;
    let airspeed_bound_h = 160;

    if(speed > airspeed_bound_h){speed = airspeed_bound_h;}
    else if(speed < airspeed_bound_l){speed = airspeed_bound_l;}
    speed = 90+speed*10;
    return speed.toString() + 'deg';
}

WidjetAirSpeed.propTypes = {
    instSize: PropTypes.string.isRequired
};


export default WidjetAirSpeed;