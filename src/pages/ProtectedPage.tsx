import React, { useEffect, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useGoogleLogin } from '@react-oauth/google';
import { apiGet, apiPost } from '../utils/apiUtils';
import { saveTabLS } from './MainPageUtils';
import { getLS, shortUid } from '../utils/appUtils';
import { PubSubEvent, usePub, useSub } from '../hooks/usePubSub';

const ProtectedPage = (props: any) => {
  const { user, jwtToken, setJwtToken } = useAppContext();
  const publish = usePub();

  const onLoginSuccess = async ({
    code,
    isAnonymous,
    settingJson
  }: {
    code: string;
    isAnonymous: boolean;
    settingJson: string;
  }) => {
    const url = isAnonymous === true ? `/api/auth/anonymous` : `/api/auth/google`;
    const { data: authRes } = await apiPost(url, {
      // http://localhost:3001/auth/google backend that will exchange the code
      payload: { code, userId: getLS('userId', ''), settingJson },
      noAuth: true
    });
    if (!authRes?.jwtToken) {
      alert('Auth or Backend Service failed.');
      return;
    }
    // console.log('authRes', authRes);
    localStorage.setItem('tk', authRes?.jwtToken);

    // try to get /userinfo with jwtToken
    const {
      data: { user }
    } = await apiGet('/api/auth/userinfo', { noCache: true });
    // console.log('user', user);

    localStorage.setItem('user', JSON.stringify(user));
    setJwtToken ? setJwtToken(authRes.jwtToken) : '';
    // console.log('user', user);
    publish(PubSubEvent.SignInDone, user);

    // TODO: improve this without reloading page
    if (!isAnonymous) {
      window.location.reload();
    }
  };

  // function to show Google OAuth Popup for Sign-in
  const googleOAuthPopupLogin = useGoogleLogin({
    onSuccess: ({ code }) => {
      const settingJson = {
        tabs: [
          {
            userWidgets: getLS('userWidgets0', [], true),
            userLayout: getLS('userLayout0', [], true)
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {}
        ]
      };
      onLoginSuccess({ code, isAnonymous: false, settingJson: JSON.stringify(settingJson) });
    },
    flow: 'auth-code'
  });

  useSub(PubSubEvent.SignIn, () => {
    // LOGIN FLOW - user wants to Login with Google OAuth
    googleOAuthPopupLogin();
  });

  useEffect(() => {
    // LOGIN FLOW - for Anonymous User (only the 1st time)
    const token = getLS('tk', '');
    if (!token) {
      const userId = getLS('userId', shortUid(), false);
      localStorage.setItem('userId', userId);
      // console.log('--- userId', userId, shortUid());
      onLoginSuccess({ code: userId, isAnonymous: true, settingJson: '' });
    }
  }, []);

  return jwtToken ? (
    props.children
  ) : (
    <div className="flex flex-col items-center">
      <div className="m-2">
        {/* <button className="mt-2 p-2 btn" onClick={() => googleLogin()}>
          Getting Started
        </button> */}
      </div>

      {/* <div className="m-2 mt-12 w-full flex flex-col items-center">
        <h3>Start your morning routine with your Personal Dashboard and Widgets</h3>
        <div className="m-2 p-2">
          <img src="https://i.ibb.co/NNpqTQS/image.png" />
        </div>
      </div> */}

      <footer className="ml-2 mt-4 text-sm">
        {/* <hr className="border-gray-100" /> */}
        Dashb.io |{' '}
        <a href="https://github.com/ngduc/dashb" target="_blank" className="link-minor">
          Read more on Github
        </a>
      </footer>
    </div>
  );
};

export default ProtectedPage;
