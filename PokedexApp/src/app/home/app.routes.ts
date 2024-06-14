import { RouterModule, Routes, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchComponent } from '../search/search.component';

export const routes: Routes = [
    // { path: '', component: AppComponent }, Temp fix until I add home component as route duplicates
    { path: 'search', component: SearchComponent }
  ];


export const AppRoutingModule = RouterModule.forRoot(routes, { useHash: true });

export const appRouterProviders = [provideRouter(routes)];