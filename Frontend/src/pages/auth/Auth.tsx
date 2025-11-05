import { useEffect, useState } from 'react';
import LoginPage from '@/components/auth/Login';
import {  useSearchParams } from 'react-router-dom';
import { RegisterPage } from '@/components/auth/Register';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [path, setPath] = useState(searchParams.get('path'));
  useEffect(() => {
    setPath(searchParams.get('path'));
    if(!path) {
      setPath('login');
      window.history.pushState({}, '', '?path=login');
    }
    console.log('Path changed:', searchParams.get('path'));
  }, [searchParams]);

  return (
    <>
      {path === 'login' && <LoginPage />}
      {path === 'register' && <RegisterPage />}
    </>
  );
};

export default Auth;