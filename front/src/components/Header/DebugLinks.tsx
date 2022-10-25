import React, {useEffect} from "react";
import {Link} from "react-router-dom";

import './DebugLinks.scss';

/***
 * @deprecated TODO REMOVE DEBUG
 */

const DebugLinks: React.FC = () => {
  useEffect(() => console.warn('Component %c DebugLinks %c need to be removed in production!', 'font-weight: bold; background-color: #FFD580', 'font-weight: normal'), []);
  return (
    <div className="debug-links-container">
      <Link to="/">Home</Link>
      <Link to="login">Login</Link>
      <Link to="configurations">Configurations</Link>
      <Link to="equipments">Equipments</Link>
      <Link to="webgl">WebGL</Link>
    </div>

  );
}

export default DebugLinks;