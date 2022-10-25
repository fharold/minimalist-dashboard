import React from 'react';

import './Title.scss';

const Title:React.FC = (props) => {
  return (
    <div className="title-component">
      {props.children}
    </div>
  )
}

export default Title;