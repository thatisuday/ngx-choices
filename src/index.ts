import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { autoSizeInputModule } from 'ngx-autosize-input';
import { NgxChoicesComponent } from './ngx-choices.component';
import { HttpClientModule } from '@angular/common/http';

export * from './ngx-choices.component';
export * from './ngx-choices.interface';
export * from './ngx-choices.constants';
export * from './ngx-choices.enum';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    autoSizeInputModule,
    HttpClientModule
  ],
  declarations: [
    NgxChoicesComponent
  ],
  exports: [
    NgxChoicesComponent
  ]
})
export class NgxChoicesModule { }
