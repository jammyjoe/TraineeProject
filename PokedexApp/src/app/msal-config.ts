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
            authority: 'https://login.microsoftonline.com/e712b66c-2cb8-430e-848f-dbab4beb16df',
            postLogoutRedirectUri: '/'
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: isIE,
        },
            system: {
            allowNativeBroker: false, // Disables native brokering support
        }
    });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect,
        authRequest: {
            scopes: ['PokemonAPI.Read'],
        },
    };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, string[]>([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ['localhost', environment.scopeUri],
    ]);

    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap,
    };
}
