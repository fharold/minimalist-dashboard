import React, {useEffect, useMemo, useState} from "react";
import {ServiceRepository} from "services/serviceRepository";
import {User} from "models/user";
import {toast} from "react-toastify";
import {Navigation} from "../../../utils/routes";
import {useParams} from "react-router-dom";
import './UserDetails.scss'
import BoxV2 from "../../Shared/BoxV2";
import Status = User.Status;
import List from "../../Shared/List/List";
import SalesDetailsCustomerAdapter from "../../../adapter/SalesDetailsCustomerAdapter";
import SalesDetailsCustomerDataProvider from "../../../adapter/SalesDetailsCustomerDataProvider";
import {headerStore} from "stores/headerStore";
import {useTranslation} from "react-i18next";

const SalesDetails: React.FC = () => {
  const userService = ServiceRepository.getInstance().userSvc;
  const {userId} = useParams();
  const [user, setUser] = useState<User.DTO | undefined>();
  const setHeader = headerStore(state => state.setHeaderProps);
  const [customerDataProvider] = useState(new SalesDetailsCustomerDataProvider(ServiceRepository.getInstance().userSvc,
    user?.id));
  const {t} = useTranslation();

  const adapter = useMemo(() => new SalesDetailsCustomerAdapter(t, customerDataProvider,
    {
      rowSelected(obj: User.DTO) {
        Navigation.navigate(`/customers/${obj.id}`, true);
      }
    }), [customerDataProvider, t]);

  setHeader({
    title: User.prettyName(user),
    subtitle: t('salesDetailsPageSubtitle'),
    backEnabled: true
  });

  useEffect(() => {
    if (user?.id) customerDataProvider.referentId = user?.id;
  }, [customerDataProvider, user]);


  useEffect(() => {
    if (!userId) return Navigation.navigate('/sales', true);
    userService.getUser(userId).then((user => {
      setUser(user)
    }));
  }, [userId, userService])

  const sendAccess = async (user: User.DTO): Promise<void> => {
    Navigation.navigate(`/access/${userId}`, true);
  }

  return <div className={'user-details-page'}>
    <div className={'user-details-container'}>
      <BoxV2 title={t('salesDetailsPageDetailsSection')}
             rightButton={{label: t('edit'), onClick: () => Navigation.navigate(`/sales/edit/${userId}`, true)}}>
        <p style={{fontWeight: 600}}>{user?.firstName + ' ' + user?.lastName}</p>
        <p>{user?.email}</p>
        <p>{user?.profile?.phone}</p>
      </BoxV2>
      <BoxV2 title={t('salesDetailsPageAccessSection')}
             leftButton={{label: t('edit'), onClick: () => Navigation.navigate(`/sales/edit/${userId}`, true)}}
             rightButton={{
               label: t('salesDetailsPageAccessSendBtn'), onClick: () => {
                 if (user) sendAccess(user)
               }
             }}>
        <p style={{
          fontWeight: 600,
          color: user?.status === User.Status.ENABLED ? '#7acc58' : '#cc5858'
        }}>
          {user?.status === User.Status.ENABLED ? t('salesDetailsPageAccessStatus') : t('salesDetailsPageAccessStatusRevoked')}
        </p>
        <p>{t('salesDetailsPageAccessExpiresAt')} <span
          style={{fontWeight: 600}}>{user?.expireAt && user?.expireAt > 0 ? new Date(user?.expireAt * 1000).toLocaleDateString() : t('salesDetailsPageAccessStatusExpired')}</span>
        </p>
        <p>{t('salesDetailsPageAccessLastLogin')}<span
          style={{fontWeight: 600}}>{user?.lastLogin && user?.lastLogin > 0 ? new Date(user?.lastLogin * 1000).toLocaleDateString() : t('salesDetailsPageAccessStatusNever')}</span>
        </p>
      </BoxV2>
      <BoxV2 title={t('salesDetailsPageCustomerListSection')}
             rightButton={{
               label: t('salesDetailsPageCustomerListAddBtn'), onClick: () => {
                 Navigation.navigate('/customers/create', true);
               }
             }}
      />
    </div>
    <List adapter={adapter} dataProvider={customerDataProvider}/>
  </div>;
}

export default SalesDetails;