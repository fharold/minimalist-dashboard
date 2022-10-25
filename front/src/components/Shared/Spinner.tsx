import React, {SVGProps} from 'react';

import './Spinner.scss';

interface SpinnerProps extends SVGProps<SVGSVGElement> {
  inlined?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({inlined = false, ...SVGProps}) => {
  return (
    <svg className="spinner" viewBox="0 0 50 50" {...SVGProps} style={{
      position: inlined ? 'relative' : 'absolute',
      top: inlined ? 0 : '50%',
      margin: inlined ? '1rem 0 1rem -25px' : '-25px 0 0 -25px',
      ...SVGProps.style
    }}>
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
    </svg>
  );
};

export default Spinner;