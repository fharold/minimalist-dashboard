import React from "react";
import './Bargraph.scss'

interface BargraphProps {
    maxValue: number,
    maxLabel: string,
    minValue: number,
    minLabel: string,
    value: number,
    title: string
}

interface BargraphState {

}

export default class Bargraph extends React.Component<BargraphProps, BargraphState> {
    render() {
        console.log((this.props.maxValue - this.props.minValue) )
        console.log((this.props.maxValue - this.props.minValue) / this.props.value)
        console.log((this.props.maxValue - this.props.minValue) / this.props.value * 50)

        return <div className={'bargraph'}>
            <p className={'title'}>{this.props.title.toUpperCase()}</p>
            <p className={'label max'}>{this.props.maxLabel}</p>
            <div className={'graph'}>
                <div className={'value'} style={{height: `${(this.props.value - this.props.minValue) / (this.props.maxValue - this.props.minValue) * 100}%`}}/>
            </div>
            <p className={'label min'}>{this.props.minLabel}</p>
        </div>
    }
}