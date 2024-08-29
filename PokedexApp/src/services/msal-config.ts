// msal-config.ts
import { PublicClientApplication, InteractionType, IPublicClientApplication } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../environments/environment';

const isIE = window.navigator.userAgent.indexOf('MSIE') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: environment.uiClientId,
            redirectUri: environment.redirectUrl,
            authority: `https://login.microsoftonline.com/${environment.uitenantId}`,
            postLogoutRedirectUri: '/'
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: isIE,
        },
            system: {
            allowNativeBroker: false, 
        }
    });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect,
        authRequest: {
            scopes: ['pokemonapi-read'],
        },
    };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, string[]>([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ['https://localhost:5019/api/Pokemon', ["api://76792183-f318-4ab5-9eab-da4315d62dc3/pokedex-read"]],
    ]);

    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap,
    };
}
