import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { WorldmapComponent } from './worldmap/worldmap.component';

import {RouterModule} from '@angular/router';
import * as $ from 'jquery';

//import {MaterialModule} from '@angular/material';

//import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    RegisterComponent,
    SigninComponent,
    WorldmapComponent



  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //MaterialModule,

    RouterModule.forRoot([
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path:'app-worldmap',
        component: WorldmapComponent
      },
      {
        path: '',
        redirectTo: '/app-worldmap',
        pathMatch: 'full'

      }
    ])

  ],
  exports:[
    UsersComponent
  ],
  providers: [
    UsersComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
