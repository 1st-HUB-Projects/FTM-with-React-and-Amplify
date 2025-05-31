import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Authenticator } from "@aws-amplify/ui-react";
import config from '../amplify_outputs.json'; // auto-generated
import { Amplify } from 'aws-amplify';
import type { Schema } from '../amplify/data/resource.ts';
import { generateClient } from 'aws-amplify/api';

Amplify.configure(config);

export const client = generateClient<Schema>()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </StrictMode>,
)
