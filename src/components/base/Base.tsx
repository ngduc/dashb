import React from 'react';

export function handleReturn({ error, isLoading }: any, element: React.ReactElement) {
  if (error) {
    return <span>ERROR: {JSON.stringify(error)}</span>;
  }
  if (isLoading) {
    return <span>Loading...</span>;
  }
  return element;
}
