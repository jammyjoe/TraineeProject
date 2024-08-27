import { PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';
import { MsalModule, MsalInterceptor, MsalService, MsalGuard } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';

// MSAL Configuration
export const msalConfig = {
  auth: {
    clientId: '76792183-f318-4ab5-9eab-da4315d62dc3', // Application (client) ID from the Azure portal
    authority: 'https://login.microsoftonline.com/e712b66c-2cb8-430e-848f-dbab4beb16df', // Directory (tenant) ID from the Azure portal
    redirectUri: 'https://pokedex-dev-web-app.azurewebsites.net/' // The URI to redirect to after login
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: true // Set to true for IE 11 or lower
  }
};

// MSAL Guard Configuration
export const msalGuardConfig = {
  interactionType: InteractionType.Redirect, // Use Redirect API for sign-in
  authRequest: {
    scopes: ['user.read']
  }
};

// MSAL Interceptor Configuration
export const msalInterceptorConfig = {
  interactionType: InteractionType.Redirect,
  authRequest: {
    scopes: ['api://76792183-f318-4ab5-9eab-da4315d62dc3/expose-api-scope'] // Scope to access your API
  }
};
