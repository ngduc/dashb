import { useEffect } from 'react';
import { EventEmitter } from 'eventemitter3';

const emitter = new EventEmitter();

export const PubSubEvent = {
  Delete: 'Delete',
  ThemeChange: 'ThemeChange',
  SignIn: 'SignIn',
  SignInDone: 'SignInDone',
  Moving: 'Moving',
  MovingToast: 'MovingToast'
};

export const useSub = (event: string, callback: any) => {
  const unsubscribe = () => {
    emitter.off(event, callback);
  };

  useEffect(() => {
    emitter.on(event, callback);
    return unsubscribe;
  }, []);

  return unsubscribe;
};

export const usePub = () => {
  return (event: string, data: any) => {
    emitter.emit(event, data);
  };
};
