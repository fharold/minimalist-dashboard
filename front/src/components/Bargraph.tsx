import React from "react";
import './Bargraph.scss'

export enum SENSORS_NAME {
    OIL_P = 'oil_p',
    OIL_T = 'oil_t',
    WATER_T = 'water_t',
    EGT = 'egt',
    LAMBDA = 'lambda',
    FUEL = 'fuel',
    BOOST = 'boost'
}

interface BargraphProps {
    maxValue: number,
    maxLabel: string,
    minValue: number,
    minLabel: string,
    value: number,
    sensor: SENSORS_NAME,
    getColor(value: number): string
}

interface BargraphState {

}

export default class Bargraph extends React.Component<BargraphProps, BargraphState> {
    render() {
        const segmentsCount = 12;

        console.log((this.props.maxValue - this.props.minValue) )
        console.log((this.props.maxValue - this.props.minValue) / this.props.value)
        console.log((this.props.maxValue - this.props.minValue) / this.props.value * 50)

        return <div className={'container'}>
            <img className={'title'} src={`/assets/img/${this.props.sensor.toLowerCase()}.png`} alt={this.props.sensor} />
            <div className={"bargraph"}>
                <p className={'label max'}>{this.props.maxLabel}</p>
                <div className={'graph'}>
                    {
                        [...Array(segmentsCount)].map((x, i) => {
                            let scaledValue = (this.props.value - this.props.minValue) / (this.props.maxValue - this.props.minValue) * (segmentsCount - 1);
                            return <div
                                className={"led"}
                                style={{background: i >= scaledValue && i !== 0 ? "#303030" : this.props.getColor(this.props.value)}}>
                                {x}
                            </div>
                        })
                    }
                    {/*<div className={'value'} style={{height: `${(this.props.value - this.props.minValue) / (this.props.maxValue - this.props.minValue) * 100}%`}}/>*/}
                </div>
                <p className={'label min'}>{this.props.minLabel}</p>
            </div>
        </div>
    }
}