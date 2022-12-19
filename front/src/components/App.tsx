import React from 'react';

import './App.scss';
import {ServiceRepository} from "../services/serviceRepository";
import Bargraph from "./Bargraph";

const App: React.FC = () => {

    return (
        <div className="app">
            <Bargraph
                title={"Oil\n(°C)"}
                maxValue={130}
                maxLabel={"130"}
                minValue={50}
                minLabel={"50"}
                value={120} />
            <Bargraph
                title={"Oil\n(bar)"}
                maxValue={8}
                maxLabel={"8"}
                minValue={0}
                minLabel={"0"}
                value={1.5} />
            <Bargraph
                title={"Water\n(°C)"}
                maxValue={120}
                maxLabel={"120"}
                minValue={60}
                minLabel={"60"}
                value={90} />
            <Bargraph
                title={"EGT\n(°C)"}
                maxValue={1000}
                maxLabel={"1000"}
                minValue={0}
                minLabel={"0"}
                value={200} />
            <Bargraph
                title={"Fuel\n(L)"}
                maxValue={40}
                maxLabel={"40"}
                minValue={0}
                minLabel={"0"}
                value={30} />
            <Bargraph
                title={"Boost\n(bar)"}
                maxValue={1.5}
                maxLabel={"1.5"}
                minValue={-1}
                minLabel={"-1"}
                value={1} />
        </div>
    );
};

export default App;
