import React from "react";
import './ButtonMoreInfo.scss'

const ButtonMoreInfo: React.FC = () => {
  return <a className={"button-more-info"} href={'https://www.ceva.com'}>
    <img src={"/assets/img/globe_v2.png"} alt={"globe"} />
    <p>{'For more informations, visit'}<br/><b>WWW.CEVA.COM</b></p>
  </a>;
}

export default ButtonMoreInfo;