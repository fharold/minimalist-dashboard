import React, {FormEvent, useEffect, useState} from 'react';
import {pxToRem} from 'utils/HtmlClassUtils';
import {Listener, ServiceRepository} from 'services/serviceRepository';
import {CookieUtils} from 'utils/cookieUtils';
import {Policy} from 'models/policy/policy';
import {Navigation} from 'utils/routes';
import Box from 'components/Shared/Box';
import Title from 'components/Shared/Title';

const Login: React.FC = () => {
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const authSvc = ServiceRepository.getInstance().authSvc;
  const userSvc = ServiceRepository.getInstance().userSvc;
  const policySvc = ServiceRepository.getInstance().policySvc;

  useEffect(() => CookieUtils.clearToken(), []);

  useEffect(() => {
    const onPolicyUpdate: Listener<Policy> = {
      onSubjectUpdate(sub?: Policy) {
        console.log('sub update', sub?.getLandingURL());
        Navigation.navigate(sub?.getLandingURL() || '/', false);
      }
    };

    policySvc.addListener(onPolicyUpdate);
    return () => policySvc.removeListener(onPolicyUpdate);
  }, [policySvc]);

  useEffect(() => {
    if (username.length > 0 && password.length > 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [username, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsFormValid(false);
    setError(false);
    console.log(e);

    try {
      await authSvc.login(username, password);
      await userSvc.refreshCurrentUserProfile();

    } catch (e) {
      console.error(e);
      return setError(true);
    }
  };

  return (
    <Box width={pxToRem(690)} margin={`${pxToRem(100)} 0 0 0`}>
      <Title>Standard Hatchery Layout</Title>

      <div className="box-content border radius-30">

        <form onSubmit={handleSubmit} className="form flex-center flex-column">
          <input placeholder="Username" type="text" autoComplete="username" onChange={e => setUserName(e.target.value)}/>
          <input placeholder="Password" type="password" autoComplete="current-password" onChange={e => setPassword(e.target.value)}/>

          {error && <p className={'label-error'}>Les identifiants renseignés ne nous permettent pas de vous authentifier.</p>}

          <button className={'button light'} type="submit" disabled={!isFormValid}>OK</button>
        </form>

      </div>
    </Box>
  );
};

export default Login;