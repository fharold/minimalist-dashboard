import React from "react";
import {Property} from "csstype";

import './Box.scss';

type BoxProps = {
  width?: Property.Width;//number | string;
  height?: Property.Width;
  maxWidth?: Property.Width;
  maxHeight?: Property.Width;
  overflow?: Property.Overflow;
  backgroundColor?: Property.Color;
  margin?: Property.Margin;
  className?: string;
}

const Box: React.FC<BoxProps> = (props) => {
  return (
    <div className={`box ${props.className || ''}`} style={{
      width: props.width,
      height: props.height,
      maxWidth: props.maxWidth,
      maxHeight: props.maxHeight,
      overflow: props.overflow,
      backgroundColor: props.backgroundColor,
      margin: props.margin,
    }}>
      {props.children}
    </div>
  )
}

export default Box;