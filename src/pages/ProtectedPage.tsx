import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useGoogleLogin } from '@react-oauth/google';
import { apiGet, apiPost } from '../utils/apiUtils';
import { saveTabLS } from './MainPageUtils';

const ProtectedPage = (props: any) => {
  const { user, jwtToken, setJwtToken } = useAppContext();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const { data: tokensData } = await apiPost('/api/auth/google', {
        // http://localhost:3001/auth/google backend that will exchange the code
        payload: { code }
      });
      if (!tokensData?.jwtToken) {
        alert('Auth or Backend Service failed.');
        return;
      }
      // console.log('tokensData', tokensData);
      localStorage.setItem('tk', tokensData?.jwtToken);

      // try to get /userinfo with jwtToken
      const {
        data: { user }
      } = await apiGet('/api/auth/userinfo', {
        options: {
          headers: {
            authorization: `Bearer ${localStorage.getItem('tk')}`
          }
        }
      });
      localStorage.setItem('user', JSON.stringify(user));
      setJwtToken ? setJwtToken(tokensData.jwtToken) : '';
      // console.log('user', user);
    },
    flow: 'auth-code'
  });

  return jwtToken ? (
    props.children
  ) : (
    <div className="bg-red-100">
      <button onClick={() => googleLogin()}>Login with Google</button>
    </div>
  );
};

export default ProtectedPage;
