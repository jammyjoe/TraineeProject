// src/app/auth-config.ts
import { PublicClientApplication, InteractionType, LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: 'your-client-id', // Replace with your application's client ID
    authority: 'https://login.microsoftonline.com/your-tenant-id', // Replace with your tenant ID
    redirectUri: 'http://localhost:4200', // Replace with your application's redirect URI
  },
  cache: {
    cacheLocation: 'localStorage', // This can be 'localStorage' or 'sessionStorage'
    storeAuthStateInCookie: false, // Set to true if you want to store auth state in cookies
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: number, message: string, containsPii: boolean) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    },
  },
};

export const protectedResources = {
  api: {
    endpoint: 'https://pokedex-dev-web-api.azurewebsites.net/api', // Your Web API URL
    scopes: ['api://76792183-f318-4ab5-9eab-da4315d62dc3/expose-api-scope'] // Your API scope
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);
