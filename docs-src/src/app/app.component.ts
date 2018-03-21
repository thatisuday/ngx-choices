import { NgForm } from '@angular/forms';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { REGEX_TYPES, NGX_CHOICES_MODE, NGX_CHOICES_CONF } from 'ngx-choices';
import _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  choices = [
    {email: 'kate@gmail.com', name: 'Kate <kate@gmail.com>', username: 'kate_512', avatar: 'http://lorempixel.com/50/50/people/'},
    {email: 'jessica@gmail.com', name: 'Jessica <jessica@gmail.com>', username: 'jessica.124', avatar: 'http://lorempixel.com/50/50/people/'}
  ];
  
  items = [
    {email: 'josh@gmail.com', name: 'Josh <josh@gmail.com>', username: 'josh_985', avatar: 'http://lorempixel.com/50/50/people/'}, 
    {email: 'jack@gmail.com', name: 'Jack <jack@gmail.com>', username: 'jack_rose_11', avatar: 'http://lorempixel.com/50/50/people/'}, 
    {email: 'kate@gmail.com', name: 'Kate <kate@gmail.com>', username: 'kate_512', avatar: 'http://lorempixel.com/50/50/people/'}, 
    {email: 'mira@gmail.com', name: 'Mira <mira@gmail.com>', username: 'mira.love', avatar: 'http://lorempixel.com/50/50/people/'}, 
    {email: 'mike@gmail.com', name: 'Mike <mike@gmail.com>', username: 'mike_63', avatar: 'http://lorempixel.com/50/50/people/'}, 
    {email: 'peter@gmail.com', name: 'Peter <peter@gmail.com>', username: 'peter_1241', avatar: 'http://lorempixel.com/50/50/people/'},
    {email: 'jessica@gmail.com', name: 'Jessica <jessica@gmail.com>', username: 'jessica.124', avatar: 'http://lorempixel.com/50/50/people/'}, 
    {email: 'winston@gmail.com', name: 'Winston <winston@gmail.com>', username: 'winston_c.1', avatar: 'http://lorempixel.com/50/50/people/'}, 
    {email: 'erica@gmail.com', name: 'Erica <erica@gmail.com>', username: 'erica-54', avatar: 'http://lorempixel.com/50/50/people/'}, 
    {email: 'sarah@gmail.com', name: 'Sarah <sarah@gmail.com>', username: 'sarah_in', avatar: 'http://lorempixel.com/50/50/people/'},
  ];

  config: NGX_CHOICES_CONF = {
    mode: NGX_CHOICES_MODE.ABSTRACT,
    value: 'email',
    label: 'name',
    meta: 'username',
    unique: true,
    filter: true,
    avatar: 'avatar',
    pattern: REGEX_TYPES.EMAIL,
    minLength: 3,
    maxLength: 15,
    maxSelections: 5,
    hideInputOnMaxSelections: true,
    acceptUserInput: false,
    placeholder: 'Type email address...',
    style: {
      minInputWidth: '200px'
    }
  };

  constructor(
    private http: HttpClient
  ) {}

  showChanges(event) {
    console.log('(onChange) choices -> ', this.choices);
  }

  showQuery(query) {
    console.log('(onType) query -> ', this.choices);
  }

  showError(err) {
    console.log('(onError) error -> ', this.choices);
  }

  submit(form: NgForm) { 
    console.log('form.value', form.value);
  }
}
