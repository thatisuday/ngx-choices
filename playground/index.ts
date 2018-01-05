/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { NgxChoicesModule }  from 'ngx-choices';


/*************************************************************/

@Component({
  selector: 'app',
  template: `<ngx-choices></ngx-choices>`
})
class AppComponent {}


/*************************************************************/

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, NgxChoicesModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
