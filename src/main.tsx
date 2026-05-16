import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import AuthenticatedApp from './App.jsx'; // This imports the default export from App.tsx

// --- Stylesheet Imports ---
// This is the base styling required by the Amplify UI components. It must come first.
import '@aws-amplify/ui-react/styles.css';
// This is your new custom stylesheet for the dark theme.
import './styles.css'; 
// This is your global app stylesheet (e.g., for TailwindCSS).
import './index.css';

// Import the generated backend configuration file.
import outputs from '../amplify_outputs.json';

// Configure the Amplify library with your backend resources. This connects the frontend to the cloud.
Amplify.configure(outputs);

// This is the main entry point that tells React where to render the application.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* This renders your App component, which handles the Authenticator UI and the main app logic. */}
    <AuthenticatedApp />
  </React.StrictMode>
);

