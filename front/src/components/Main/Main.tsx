import React, {useState} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import WebGL from 'webgl/components/WebGL';
import Configurations from 'components/Main/Configuration/Configurations';
import AnnotationOrangeFixedDescriptions from 'webgl/components/Annotations/AnnotationOrangeFixedDescriptions';

import {ReactComponent as CrackedEgg} from 'assets/images/cracked-egg.svg';
import './Main.scss';
import {URLs} from "../../utils/urls";
import Login from "./Login";
import Equipments from "./Equipment/Equipments";
import EquipmentPage from "./Equipment/EquipmentPage";
import CevaAdminDashboard from "./CevaAdminDashboard";
import SalesRepDashboard from "./SalesRepDashboard";
import Translations from "./Translations";
import CreateLanguage from "./CreateLanguage";
import TranslationPage from "./TranslationPage";
import {Navigation} from "../../utils/routes";
import {ServiceRepository} from "../../services/serviceRepository";
import {User} from "../../models/user";
import UsersList from "./User/UsersList";
import CustomerCreate from "./User/CustomerCreate";
import SalesCreate from "./User/SalesCreate";
import SalesEdit from "./User/SalesEdit";
import SalesDetails from "./User/SalesDetails";
import CustomerDetails from "./User/CustomerDetails";
import CustomerEdit from "./User/CustomerEdit";
import RoomDetails from "./Configuration/RoomDetails";
import ConfigurationEdit from "./Configuration/ConfigurationEdit";
import Rooms from "./Configuration/Rooms";
import {AnnotationEdit} from "./Equipment/AnnotationEdit";
import {AnnotationCreate} from "./Equipment/AnnotationCreate";
import ConfigurationViewer from "components/Main/Configuration/ConfigurationViewer";
import HelpPage from "./HelpPage";
import Profile from "./User/Profile";
import AdminConfigurationCreate from "./Configuration/AdminConfigurationCreate";
import AccessSendPage from "./Configuration/AccessSendPage";

const Racine: React.FC = () => {
  const policySvc = ServiceRepository.getInstance().policySvc;
  Navigation.navigate(policySvc.policy.getLandingURL(), false);

  return <p>Redirection en cours. Si vous êtes coincés sur cette page, cliquez <a href="/">ici</a></p>;
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const {search} = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Main: React.FC = () => {
  const [accountType] = useState<string>('customer'); // TODO retrieve from user store/service
  const usrSvc = ServiceRepository.getInstance().userSvc;
  const [currentUser, setCurrentUser] = useState(usrSvc.currentUser);
  let query = useQuery();
  usrSvc.addListener({
    onSubjectUpdate(sub?: User.DTO) {
      setCurrentUser(sub);
    }
  })

  return (
    <div className={`main flex flex-center-horizontal ${accountType}`}>
      <Routes>
        <Route path={'/'} element={<Racine/>}/>
        <Route path={'CADashboard'} element={<CevaAdminDashboard/>}/>
        <Route path={'SDashboard'} element={<SalesRepDashboard/>}/>
        <Route path={'lost'} element={<p>Lost</p>}/>
        <Route path={URLs.Front.LOGIN} element={<Login/>}/>
        <Route path="translations" element={<Translations/>}/>
        <Route path="translations/:code" element={<TranslationPage/>}/>
        <Route path="createLanguage" element={<CreateLanguage/>}/>

        <Route path="help" element={<HelpPage/>}/>

        <Route path="configurations" element={<Configurations/>}/>
        <Route path="configurations/edit/:configId" element={<ConfigurationEdit customerId={query.get('customerId')}
                                                                                cfgToCloneId={query.get('cfgToCloneId')}/>}/>
        <Route path="configurations/create" element={<AdminConfigurationCreate room={query.get('room')}/>}/>
        <Route path="configurations/:configId" element={<ConfigurationViewer/>}/>

        <Route path="rooms" element={<Rooms/>}/>
        <Route path="rooms/:name" element={<RoomDetails customerId={query.get('customerId')}/>}/>
        <Route path="access/:userId" element={<AccessSendPage />}/>

        <Route path="annotations/:id" element={<AnnotationEdit/>}/>
        <Route path="equipments/:id/annotations/create" element={<AnnotationCreate/>}/>

        <Route path="equipments" element={<Equipments room={query.get('room')}/>}/>
        <Route path="equipments/:id" element={<EquipmentPage/>}/>
        <Route path="equipment/:equipKey" element={<ConfigurationViewer/>}/>

        <Route path="customers" element={<UsersList role={User.Role.STANDARD}
                                                    referentUserId={currentUser?.role === User.Role.SALES_REP ? currentUser?.id : undefined}/>}/>
        <Route path="customers/:userId" element={<CustomerDetails/>}/>
        <Route path="customers/edit/:userId" element={<CustomerEdit/>}/>
        <Route path="customers/create" element={<CustomerCreate/>}/>


        <Route path="sales" element={<UsersList role={User.Role.SALES_REP}/>}/>
        <Route path="sales/:userId" element={<SalesDetails/>}/>
        <Route path="sales/create" element={<SalesCreate/>}/>
        <Route path="sales/edit/:userId" element={<SalesEdit/>}/>

        <Route path="profile" element={<Profile/>}/>

        <Route path="*" element={
          <div style={{textAlign: 'center'}}>
            <CrackedEgg/>
            <div style={{color: 'pink', fontSize: '2rem', padding: '2rem'}}><b>QUATRE CENT QUATRE</b></div>
          </div>
        }/>
      </Routes>

      <WebGL/>
      <AnnotationOrangeFixedDescriptions/>
    </div>
  );
};

export default Main;
