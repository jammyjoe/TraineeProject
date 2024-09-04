// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClientModule, withFetch, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { MSALInstanceFactory, MSALGuardConfigFactory, MSALInterceptorConfigFactory } from './services/msal-config';
import { MsalService, MsalGuard, MsalInterceptor, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MSAL_INSTANCE, MsalRedirectComponent } from '@azure/msal-angular';

bootstrapApplication(AppComponent, {
  providers: [
    HttpClient, 
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    provideRouter(routes),
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    MsalRedirectComponent,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));