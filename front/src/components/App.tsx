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
                    return "#FF0000"
                }}
                maxValue={130}
                maxLabel={"130"}
                minValue={50}
                minLabel={"50"}
                value={130}
            />
            <Bargraph
                sensor={SENSORS_NAME.OIL_P}
                getColor={(value: number) => {
                    return "#FF0000"
                }}
                maxValue={8}
                maxLabel={"8"}
                minValue={0}
                minLabel={"0"}
                value={1.5} />
            <Bargraph
                sensor={SENSORS_NAME.WATER_T}
                getColor={(value: number) => {
                    return "#FF0000"
                }}
                maxValue={120}
                maxLabel={"120"}
                minValue={60}
                minLabel={"60"}
                value={90} />
            <Bargraph
                sensor={SENSORS_NAME.EGT}
                getColor={(value: number) => {
                    return "#FF0000"
                }}
                maxValue={999}
                maxLabel={"999"}
                minValue={0}
                minLabel={"0"}
                value={200} />
            <Bargraph
                sensor={SENSORS_NAME.LAMBDA}
                getColor={(value: number) => {
                    return "#FF0000"
                }}
                maxValue={14.7}
                maxLabel={"14.7"}
                minValue={10}
                minLabel={"10"}
                value={11.5} />
            <Bargraph
                sensor={SENSORS_NAME.FUEL}
                getColor={(value: number) => {
                    return "#FF0000"
                }}
                maxValue={40}
                maxLabel={"40"}
                minValue={0}
                minLabel={"0"}
                value={30} />
            <Bargraph
                sensor={SENSORS_NAME.BOOST}
                getColor={(value: number) => {
                    return "#FF0000"
                }}
                maxValue={1.5}
                maxLabel={"1.5"}
                minValue={-1}
                minLabel={"-1"}
                value={1} />
        </div>
    );
};

export default App;
