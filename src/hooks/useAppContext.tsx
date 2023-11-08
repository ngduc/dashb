import React, { useState, createContext, useContext, useEffect } from 'react';
import { KeyValueString } from '../../types';

export type User = {
  email: string;
};

export type AppContextType = {
  user?: User | null;
  jwtToken?: string;
  setJwtToken?: React.Dispatch<React.SetStateAction<string>>;
  setUser?: React.Dispatch<React.SetStateAction<User | null>>;
  authed?: boolean;
  setAuthed?: React.Dispatch<React.SetStateAction<boolean>>;
  login?: () => void;
  logout?: () => void;
  loading?: boolean;
  tabSettings?: any;
  setTabSettings?: any;
};
const AuthContext = createContext<AppContextType>({});

export const AuthProvider = ({ children }: any) => {
  // const sessionStorageValue = JSON.parse(sessionStorage.getItem("loggedIn"));

  // const [authed, setAuthed] = useState<boolean>(sessionStorageValue);
  const [user, setUser] = useState<User | null>(
    localStorage.getItem('user') ? (JSON.parse(`${localStorage.getItem('user')}`) as User) : null
  );
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('tk') ?? '');
  const [authed, setAuthed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabSettings, setTabSettings] = useState<KeyValueString>({});

  useEffect(() => {
    // if (!authed) {
    //   fakeAsyncLoginCheck().then((activeUser) => {
    //     if (activeUser) {
    //       console.log('fake async login check called');
    //       setUser({ email: 'user1@example.com' });
    //       setAuthed(true);
    //       setLoading(false);
    //     } else {
    //       setLoading(false);
    //       setUser(null);
    //     }
    //   });
    // }
  }, []);

  const login = async (): Promise<void> => {
    const result = await fakeAsyncLogin();

    if (result) {
      console.log('user has logged in');

      setAuthed(true);
      // sessionStorage.setItem("loggedIn", "true");
    }
  };

  const logout = async (): Promise<void> => {
    const result = await fakeAsyncLogout();

    if (result) {
      console.log('The User has logged out');
      setAuthed(false);
      setUser(null);
      // sessionStorage.setItem("loggedIn", "false");
    }
  };

  /// Mock Async Login API call.
  // TODO: Replace with your actual login API Call code
  const fakeAsyncLogin = async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Logged In');
      }, 300);
    });
  };

  // Fixes the reload issue
  const fakeAsyncLoginCheck = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  };

  // Mock Async Logout API call.
  // TODO: Replace with your actual logout API Call code
  const fakeAsyncLogout = async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('The user has successfully logged on the server');
      }, 300);
    });
  };

  return (
    // Using the provider so that ANY component in our application can
    // use the values that we are sending.
    <AuthContext.Provider
      value={{
        jwtToken,
        setJwtToken,
        user,
        authed,
        setAuthed,
        setUser,
        login,
        logout,
        loading,
        tabSettings,
        setTabSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAppContext = () => useContext(AuthContext);
