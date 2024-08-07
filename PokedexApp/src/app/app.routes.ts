import { RouterModule, Routes, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, 
    { path: 'search', component: SearchComponent },
    { path: 'add', component: AddComponent },
    { path: 'edit/:id', component: EditComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];


export const AppRoutingModule = RouterModule.forRoot(routes, { useHash: true });

export const appRouterProviders = [provideRouter(routes)];