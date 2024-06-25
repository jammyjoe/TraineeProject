import { RouterModule, Routes, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchComponent } from '../search/search.component';
import { AddComponent } from '../add/add.component';

export const routes: Routes = [
    // { path: '', component: AppComponent }, Temp fix until I add home component as route duplicates
    { path: 'search', component: SearchComponent },
    { path: 'add', component: AddComponent }
  ];


export const AppRoutingModule = RouterModule.forRoot(routes, { useHash: true });

export const appRouterProviders = [provideRouter(routes)];