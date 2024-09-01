import { PublicClientApplication, InteractionType, IPublicClientApplication, LogLevel } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../environments/environment';

const isIE = window.navigator.userAgent.includes('MSIE') || window.navigator.userAgent.includes('Trident/');

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
            loggerOptions: {
                logLevel: LogLevel.Info,
            },
            allowNativeBroker: false, 
        },
    });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect,
        authRequest: {
            scopes: ['User.Read'],
        },
    };
}

// export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
//     const protectedResourceMap = new Map<string, string[]>([
//         [environment.baseUrl, environment.scopeUri],
//         ['https://graph.microsoft.com/v1.0/me', ['User.Read']],
//     ]);

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();
    protectedResourceMap.set(environment.baseUrl, environment.scopeUri);


    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap,
    };
}
