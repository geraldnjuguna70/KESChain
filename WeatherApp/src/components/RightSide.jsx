import React from "react";
import { WiCloudy, WiDaySunny, WiRain, WiRainWind, WiRaindrop, WiRaindrops } from "react-icons/wi";

const RightSide = () => {
    return (
        <div className="right-info">
            <div className="day-info">
                <div>
                    <span className="title">PRECIPITATION</span>
                    <span className="value">4 %</span>
                </div>
                <div>
                    <span className="title">HUMIDITY</span>
                    <span className="value">34 %</span>
                </div>
                <div>
                    <span className="title">WIND SPEED</span>
                    <span className="value">6 km/h</span>
                </div>
            </div>

            <ul className="days-list">
                <li>
                    <WiCloudy />
                    <span>Sat</span>
                    <span className="day-temp">23°C</span>
                </li>
                <li>
                    <WiDaySunny />
                    <span>Sun</span>
                    <span className="day-temp">28°C</span>
                </li>
                <li>
                    <WiRain />
                    <span>Mon</span>
                    <span className="day-temp">02°C</span>
                </li>
                <li>
                    <WiRainWind />
                    <span>Tue</span>
                    <span className="day-temp">14°C</span>
                </li>
            </ul>

            <div className="btn-container">
                <button className="loc-button">Search Location</button>
            </div>

        </div>

    )
};

export default RightSide;   