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
import {headerStore} from "stores/headerStore";
import {Policy} from "../../../models/policy/policy";
import ConfigurationProvider from "../../../adapter/ConfigurationProvider";
import ConfigurationAdapter from "../../../adapter/ConfigurationAdapter";
import {Configuration, Room} from "../../../models/configuration";
import Dialog from "../../Shared/Dialog";
import AssignSalesToCustomerAdapter from "../../../adapter/AssignSalesToCustomerAdapter";
import AssignSalesToCustomerDataProvider from "../../../adapter/AssignSalesToCustomerDataProvider";
import {useTranslation} from "react-i18next";

const CustomerDetails: React.FC = () => {
  const userService = ServiceRepository.getInstance().userSvc;
  const cfgSvc = ServiceRepository.getInstance().cfgSvc;
  const policyService = ServiceRepository.getInstance().policySvc;
  const {userId} = useParams();
  const {t} = useTranslation();
  const [user, setUser] = useState<User.DTO | undefined>();
  const [roomDialogVisibility, setRoomDialogVisibility] = useState<boolean>(false);
  const [salesRepDialogVisibility, setSalesRepDialogVisibility] = useState<boolean>(false);
  const [deleteDialogCfg, setDeleteDialogCfg] = useState<Configuration.DTO | undefined>(undefined);
  const [policy, setPolicy] = useState<Policy | undefined>(policyService.policy);
  const [usersSalesRep, setUsersSalesRep] = useState<User.DTO | undefined>(undefined);
  const [configurationsProvider] = useState(
    new ConfigurationProvider(ServiceRepository.getInstance().cfgSvc, userId));
  const adapter = useMemo(() => new ConfigurationAdapter(t, configurationsProvider, {
    rowSelected(obj: Configuration.DTO) {
      Navigation.navigate(`/configurations/edit/${obj.id}`, true);
    },

    onRemoveClick(obj: Configuration.DTO) {
      setDeleteDialogCfg(obj);
    },

    onEditClick(obj: Configuration.DTO) {
      Navigation.navigate(`/configurations/edit/${obj.id}`, true);
    }
  }), [configurationsProvider]);
  const setHeader = headerStore(state => state.setHeaderProps);
  const [salesToCustomerProvider] = useState(new AssignSalesToCustomerDataProvider(userService));
  const salesToCustomerAdapter = useMemo(() => new AssignSalesToCustomerAdapter(t, salesToCustomerProvider, {
    async rowSelected(obj: User.DTO) {
      if (!userId) return;
      setSalesRepDialogVisibility(false);
      toast(t('customerDetailsAssigningCustomer'));
      await userService.editUser(userId, {referentUserId: obj.id});
      toast(t('customerDetailsAssignedCustomer', {salesRep: User.prettyName(obj)}));
      userService.getUser(userId).then((user => {
        setUser(user)
      }));
    }
  }), [salesToCustomerProvider, userId, userService]);

  policyService.addListener({
    onSubjectUpdate(sub?: Policy) {
      setPolicy(sub);
    }
  })

  setHeader({
    title: User.prettyName(user),
    subtitle: t('customerDetailsPageSubtitle'),
    backEnabled: true
  });

  useEffect(() => {
    if (!userId) return Navigation.navigate('/customer', true);
    userService.getUser(userId).then((user => {
      setUser(user)
    }));
  }, [userId, userService])

  useEffect(() => {
    if (!user?.referentUserId) return;
    userService.getUser(user?.referentUserId).then((salesRep) => setUsersSalesRep(salesRep));
  }, [user?.referentUserId, userService])

  const removeCfg = async () => {
    if (!deleteDialogCfg?.id) return;
    setDeleteDialogCfg(undefined);
    toast(t('customerDetailsRemovingConfiguration'));
    await cfgSvc.removeConfiguration(deleteDialogCfg?.id)
    toast(t('customerDetailsConfigurationRemoved'));
    configurationsProvider.load();
  }

  const sendAccess = async (user: User.DTO): Promise<void> => {
    Navigation.navigate(`/access/${userId}`, true);
  }

  const triggerConfigurationCreation = (room: Room) => {
    Navigation.navigate(`/rooms/${room}?customerId=${user?.id}`, true);
  }

  return <div className={'user-details-page'}>
    <div className={'details-header customer-header'}>
      <p className={'details-header-label'}>{t('customerDetailsSalesRep')} <span style={{color: '#474747'}}>
        {User.prettyName(usersSalesRep) || 'none'}
      </span> {policy?.canChangeUserReferent() && <span className={'button secondary'} onClick={() => {
        setSalesRepDialogVisibility(true);
      }}>{t('edit')}</span>}
      </p>
    </div>
    <div className={'user-details-container'}>
      <BoxV2 title={t('customerDetailsPageDetailsSection')}
             rightButton={{label: t('edit'), onClick: () => Navigation.navigate(`/customers/edit/${userId}`, true)}}>
        <p style={{fontWeight: 600}}>{user?.firstName + ' ' + user?.lastName}</p>
        <p>{user?.email}</p>
        <p>{user?.profile?.phone}</p>
      </BoxV2>
      <BoxV2 title={t('customerDetailsPageAccessSection')}
             leftButton={{label: t('edit'), onClick: () => Navigation.navigate(`/customers/edit/${userId}`, true)}}
             rightButton={{
               label: t('customerDetailsPageAccessSendBtn'), onClick: () => {
                 if (user) sendAccess(user)
               }
             }}>
        <p>{t('customerDetailsPageAccessExpiresAt')} <span
          style={{
            fontWeight: 600,
            color: user?.expireAt && user?.expireAt > 0 ? '#7acc58' : '#cc5858'
          }}>{user?.expireAt && user?.expireAt > 0 ? new Date(user?.expireAt * 1000).toLocaleDateString() : t('customerDetailsPageAccessStatusExpired')}</span>
        </p>
        <p>{t('customerDetailsPageAccessSection')} : <span
          style={{
            fontWeight: 600,
            color: user?.status === User.Status.ENABLED ? '#7acc58' : '#cc5858'
          }}>{user?.status === User.Status.ENABLED ? t('customerDetailsPageAccessStatus') : t('customerDetailsPageAccessStatusDisabled')}</span>
        </p>
        <p>{t('customerDetailsPageAccessLastLogin')}<span
          style={{fontWeight: 600}}>{user?.lastLogin && user?.lastLogin > 0 ? new Date(user?.lastLogin * 1000).toLocaleDateString() : t('customerDetailsPageAccessStatusNever')}</span>
        </p>
      </BoxV2>
      <BoxV2 title={t('customerDetailsPageConfigurationrListSection')}
             rightButton={{label: t('customerDetailsPageConfigurationListAddBtn'), onClick: () => setRoomDialogVisibility(true)}}
      />
    </div>
    <List adapter={adapter} dataProvider={configurationsProvider}/>
    <Dialog
      dismiss={() => setRoomDialogVisibility(false)}
      visible={roomDialogVisibility}
      title={t('customerDetailsDialogTitle')}
    >
      <p onClick={() => triggerConfigurationCreation(Room.CHICK_PROCESSING)}
         className={'room-pick-list-item'}>{t(Room.CHICK_PROCESSING)}</p>
      <p onClick={() => triggerConfigurationCreation(Room.TRANSFER)}
         className={'room-pick-list-item'}>{t(Room.TRANSFER)}</p>
      <p onClick={() => triggerConfigurationCreation(Room.EGG_HANDLING)}
         className={'room-pick-list-item'}>{t(Room.EGG_HANDLING)}</p>
      <p onClick={() => triggerConfigurationCreation(Room.WASTE_DISPOSAL)}
         className={'room-pick-list-item'}>{t(Room.WASTE_DISPOSAL)}</p>
    </Dialog>
    <Dialog
      visible={!!deleteDialogCfg}
      dismiss={() => setDeleteDialogCfg(undefined)}
      title={t('customerDetailsRemoveDialogTitle', {cfgName: deleteDialogCfg?.name})}
      subtitle={t('customerDetailsRemoveDialogSubtitle')}
      positiveButton={{label: t('customerDetailsRemoveDialogConfirm'), onClick: removeCfg}}/>
    <Dialog
      visible={salesRepDialogVisibility}
      dismiss={() => setSalesRepDialogVisibility(false)}
      title={t('customerDetailsAssignCustomerNewSalesRep')}
    >
      <List adapter={salesToCustomerAdapter} dataProvider={salesToCustomerProvider}/>
    </Dialog>
  </div>;
}

export default CustomerDetails;