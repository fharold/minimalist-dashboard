import React, {useCallback, useEffect, useState} from 'react';

import './Header.scss';
import {User} from "../../models/user";
import {ServiceRepository} from "../../services/serviceRepository";
import LoggedInHeader from "./LoggedInHeader";
import LoggedOutHeader from "./LoggedOutHeader";

export interface HeaderProps {
  title: string;
  subtitle?: string;
  backEnabled: boolean;
  currentRoom?: string;
}

const Header: React.FC = () => {
  const [userProfile, setUserProfile] = useState<User.DTO>();
  const userService = ServiceRepository.getInstance().userSvc;

  userService.addListener({
    onSubjectUpdate(sub?: User.DTO) {
      setUserProfile(sub);
    }
  })

  const getCurrentUserProfile = useCallback(async () => {
    try {
      setUserProfile(await userService.getCurrentUser());
    } catch (error) {
      console.error(error);
      setUserProfile(undefined);
    }
  }, [userService]);

  useEffect(() => {
    void getCurrentUserProfile();
  }, [getCurrentUserProfile]);

  return userProfile ? <LoggedInHeader/> : <LoggedOutHeader/>;
}

export default Header;
