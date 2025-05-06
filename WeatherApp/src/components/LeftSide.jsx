import React from "react";
import { WiDayCloudyWindy, WiDaySunny} from 'react-icons/wi';

const LeftSide = () => {
    return (
        <div className="container">
            <div className="left-side">
                <div className="weather-image"></div>
                <div className="today-info">
                    <h2>Today</h2>
                    <span>{new Date().toDateString()}</span>
                    <div>
                        <WiDaySunny />
                        <span>25°C</span>
                        <span> Cloudy</span>
                    </div>
                </div>
                <div className="today-forecast">
                    <WiDaySunny />
                    <p>25°C</p>
                    <h3>Cloudy</h3>
                </div>
            </div>
            

        </div>
    )
};

export default LeftSide;