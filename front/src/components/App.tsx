import React from 'react';

import './App.scss';
import {ServiceRepository} from "../services/serviceRepository";
import Bargraph, {SENSORS_NAME} from "./Bargraph";

const App: React.FC = () => {
    return (
        <div className="app">
            <Bargraph
                sensor={SENSORS_NAME.OIL_T}
                getColor={(value: number) => {
                    if (value < 60) {
                        return "#00C0FF"
                    } else if (value < 80) {
                        return "#f59642"
                    } else if (value < 110) {
                        return "#07fa20"
                    } else if (value < 125) {
                        return "#f59642"
                    } else {
                        return "#FF0000"
                    }
                }}
                maxValue={130}
                maxLabel={"130"}
                minValue={50}
                minLabel={"50"}
                value={80}
            />
            <Bargraph
                sensor={SENSORS_NAME.OIL_P}
                getColor={(value: number) => {
                    if (value < 1) {
                        return "#FF0000"
                    } else if (value < 1.5) {
                        return "#f59642"
                    } else if (value < 7) {
                        return "#07fa20"
                    } else  {
                        return "#f59642"
                    }
                }}
                maxValue={8}
                maxLabel={"8"}
                minValue={0}
                minLabel={"0"}
                value={1.5} />
            <Bargraph
                sensor={SENSORS_NAME.WATER_T}
                getColor={(value: number) => {
                    if (value < 75) {
                        return "#00C0FF"
                    } else if (value < 100) {
                        return "#07fa20"
                    } else if (value < 105) {
                        return "#f59642"
                    } else {
                        return "#FF0000"
                    }
                }}
                maxValue={110}
                maxLabel={"110"}
                minValue={60}
                minLabel={"60"}
                value={75} />
            <Bargraph
                sensor={SENSORS_NAME.EGT}
                getColor={(value: number) => {
                    if (value < 700) {
                        return "#07fa20"
                    } else {
                        return "#f59642"
                    }
                }}
                maxValue={999}
                maxLabel={"999"}
                minValue={0}
                minLabel={"0"}
                value={200} />
            <Bargraph
                sensor={SENSORS_NAME.LAMBDA}
                getColor={(value: number) => {
                    if (value < 12) {
                        return "#07fa20"
                    } else {
                        return "#f59642"
                    }
                }}
                maxValue={15}
                maxLabel={"15"}
                minValue={9}
                minLabel={"9"}
                value={11.5} />
            <Bargraph
                sensor={SENSORS_NAME.FUEL}
                getColor={(value: number) => {
                    if (value < 10) {
                        return "#FF0000"
                    } else if (value < 20) {
                        return "#f59642"
                    } else {
                        return "#07fa20"
                    }
                }}
                maxValue={40}
                maxLabel={"40"}
                minValue={0}
                minLabel={"0"}
                value={30} />
            <Bargraph
                sensor={SENSORS_NAME.BOOST}
                getColor={(value: number) => {
                    if (value < 1.2) {
                        return "#07fa20"
                    } else {
                        return "#f59642"
                    }
                }}
                maxValue={1.5}
                maxLabel={"1.5"}
                minValue={-1}
                minLabel={"-1"}
                value={1.5} />
        </div>
    );
};

export default App;
