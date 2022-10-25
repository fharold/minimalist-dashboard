import React from "react";
import './CevaAdminDashboard.scss'
import {Link} from "react-router-dom";
import {headerStore} from "stores/headerStore";
import {ServiceRepository} from "../../services/serviceRepository";
import {User} from "../../models/user";

const SalesRepDashboard: React.FC = () => {
  ServiceRepository.getInstance().userSvc.addListener({
    onSubjectUpdate(sub?: User.DTO) {
      setHeader({
        title: "Home",
        subtitle: `Welcome, ${User.prettyName(sub)}`,
        backEnabled: true
      });
    }
  })
  const setHeader = headerStore(state => state.setHeaderProps);

  setHeader({
    title: "Home",
    subtitle: `Welcome, ${User.prettyName(ServiceRepository.getInstance().userSvc.currentUser)}`,
    backEnabled: true
  });

  return <div className={"ceva-admin-dashboard"}>
    <Link to="/customers">
      <button className={'button dark'}>My customers</button>
    </Link>
    <Link to="/customers/create">
      <button className={'button dark'}><span style={{
        background: 'white',
        width: '30px',
        minWidth: '30px',
        height: '30px',
        paddingLeft: '7px',
        paddingRight: '7px',
        borderRadius: '15px',
        color: '#3b4569'
      }}>+</span> Add new customer</button>
    </Link>
  </div>
}

export default SalesRepDashboard;