import { RouterModule, Routes, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ExploreComponent } from './explore/explore.component';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    //{ path: '', component: AppComponent },
    { path: '', component: HomeComponent }, 
    { path: 'explore', component: ExploreComponent, canActivate: [MsalGuard] }, 
    { path: 'search', component: SearchComponent, canActivate: [MsalGuard] },
    { path: 'add', component: AddComponent, canActivate: [MsalGuard]  },
    { path: 'edit/:id', component: EditComponent, canActivate: [MsalGuard] },
    { path: 'redirect', component: MsalRedirectComponent,  }, 
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];


export const AppRoutingModule = RouterModule.forRoot(routes, { useHash: true });
export const appRouterProviders = [provideRouter(routes)];