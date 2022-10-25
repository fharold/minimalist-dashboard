import React from "react";
import './CevaAdminDashboard.scss'
import {Link} from "react-router-dom";
import {headerStore} from "stores/headerStore";
import {ServiceRepository} from "../../services/serviceRepository";
import {User} from "../../models/user";
import {useTranslation} from "react-i18next";

const CevaAdminDashboard: React.FC = () => {
  ServiceRepository.getInstance().userSvc.addListener({
    onSubjectUpdate(sub?: User.DTO) {
      setHeader({
        title: t('headerAdminHome'),
        subtitle: `${t('welcome')}, ${User.prettyName(sub)}`,
        backEnabled: false
      });
    }
  })
  const {t} = useTranslation();
  const setHeader = headerStore(state => state.setHeaderProps);

  setHeader({
    title: t('headerAdminHome'),
    subtitle: `${t('welcome')}, ${User.prettyName(ServiceRepository.getInstance().userSvc.currentUser)}`,
    backEnabled: false
  });

  return <div className={"ceva-admin-dashboard"}>
    <Link to="/sales">
      <button className={'button dark'}>{t('cevaAdminDashboardSalesRepBtn')}</button>
    </Link>
    <Link to="/customers">
      <button className={'button dark'}>{t('cevaAdminDashboardCustomerBtn')}</button>
    </Link>
    <Link to="/rooms">
      <button className={'button dark'}>{t('cevaAdminDashboardConfigurationEditor')}</button>
    </Link>
    <Link to="/translations">
      <button className={'button dark'}>{t('cevaAdminDashboardTranslation')}</button>
    </Link>
  </div>
}

export default CevaAdminDashboard;