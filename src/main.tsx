import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './hooks/useAppContext';

import './index.css';
import './react-grid-layout.css';
import './react-grid-layout2.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <GoogleOAuthProvider clientId="448354404321-r5bh7g26rqulq2nahgs89il4jqoh9jek.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
