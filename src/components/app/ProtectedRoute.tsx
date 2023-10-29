import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';

const ProtectedRoute = (props: any) => {
  const { user } = useAppContext();

  return user ? props.children : <div>Unauthorized</div>;
};

export default ProtectedRoute;
