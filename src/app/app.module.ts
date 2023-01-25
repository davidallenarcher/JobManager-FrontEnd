import { EventEmitter, Input, NgModule, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { JobsRowComponent } from './components/job-row/job-row.component';

@NgModule({
  declarations: [
    AppComponent,
    JobsComponent,
    JobsRowComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [JobsComponent]
})
export class AppModule { }
