import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router'; 
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    HttpClientModule, 
    provideRouter(routes),
    provideHttpClient()
    ]
}).catch((err) =>
  console.error(err)
);
