import {User} from 'models/user';
import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {ServiceRepository} from "../../../services/serviceRepository";
import List from "../../Shared/List/List";
import UsersDataProvider from "../../../adapter/UsersDataProvider";
import UserAdapter, {UserAdapterListener} from "../../../adapter/UserAdapter";
import {Navigation} from "../../../utils/routes";
import './UsersList.scss'
import {headerStore} from "stores/headerStore";
import Dialog from "../../Shared/Dialog";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

type UsersListProps = {
  role: User.Role;
  referentUserId?: string;
}

const UsersList: React.FC<UsersListProps> = (props: UsersListProps) => {
  const [dataProvider] = useState(new UsersDataProvider(ServiceRepository.getInstance().userSvc, props.role, props.referentUserId));
  const [selectedUser, setSelectedUser] = useState<User.DTO | undefined>(undefined);
  const {t} = useTranslation();

  const listener: UserAdapterListener = useMemo(() => {
    return {
      rowSelected(obj: User.DTO): void {
        Navigation.navigate(`/${obj.role === User.Role.STANDARD ? 'customers' : 'sales'}/${obj.id}`, true);
      },
      removeClicked(user: User.DTO): void {
        setSelectedUser(user);
      }
    }
  }, []);

  const adapter = useMemo(
    () => new UserAdapter(t, dataProvider, listener, props.role === User.Role.STANDARD),
    [dataProvider, listener, props.role, t]
  );

  useEffect(() => {
    dataProvider.referentUserId = props.referentUserId;
  }, [dataProvider, props.referentUserId])

  const setHeader = headerStore(state => state.setHeaderProps);
  setHeader({
    title: props.role === User.Role.STANDARD ? "usersListCustomersListTitle" : "usersListSalesRepListTitle",
    backEnabled: true
  });

  const deleteUser = async (userToDelete: User.DTO) => {
    const usrSvc = ServiceRepository.getInstance().userSvc;

    toast(t('usersListDeletingUser'));
    try {
      await usrSvc.removeUser(userToDelete);
      setSelectedUser(undefined);
      dataProvider.load();
      toast(t('usersListUserDeleted'));
    } catch (e) {
      toast(t('usersListFailedToDeleteUser'), {
        type: "error"
      });
    }
  };

  return (
    <div className={"users-page"}>

      <List adapter={adapter} dataProvider={dataProvider}/>

      {props.role === User.Role.STANDARD && <Link className={'centered-button'} to={"/customers/create"}>
        <button className={"button light"}>{t('usersListAddCustomerButton')}</button>
      </Link>}

      {props.role === User.Role.SALES_REP && <Link className={'centered-button'} to={"/sales/create"}>
        <button className={"button light"}>{t('usersListAddSalesRepButton')}</button>
      </Link>}


      <Dialog
        visible={!!selectedUser}
        dismiss={() => setSelectedUser(undefined)}
        title={'usersListDeleteCustomerDialogTitle'}
        subtitle={'usersListDeleteCustomerDialogSubtitle'}
        positiveButton={{
          label: 'usersListDeleteCustomerDialogPositiveBtn', onClick: () => {
            if (selectedUser) deleteUser(selectedUser);
          }
        }}
      />
    </div>
  );
};

export default UsersList;