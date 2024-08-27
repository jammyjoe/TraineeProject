import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: '76792183-f318-4ab5-9eab-da4315d62dc3',
    authority: 'https://login.microsoftonline.com/e712b66c-2cb8-430e-848f-dbab4beb16df',
    redirectUri: 'http://localhost:4200/', // Update for production
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ['user.read'],
};
