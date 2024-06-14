import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    // { path: '', component: AppComponent }, Temp fix until I add home component as route duplicates
    { path: 'search', component: SearchComponent }
  ];