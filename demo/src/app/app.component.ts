import { Component } from '@angular/core';
import { NGX_CHOICES_CONF, REGEX_TYPES } from './src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  config: NGX_CHOICES_CONF = {
    value: 'email',
    label: 'name',
    meta: 'location',
    filter: true,
    placeholder: 'Type to search',
    unique: true,
    pattern: REGEX_TYPES.EMAIL
  };

  choices = ['mina.dosan@gmail.com', 'mike.json@hotmail.com'];

  items = [
    {name: 'Mina Dosan', location: 'USA', email: 'mina.dosan@gmail.com'},
    {name: 'Mike Json', location: 'South Africa', email: 'mike.json@hotmail.com'},
    {name: 'Peter Thompson', location: 'Canada', email: 'peter.1992@gmail.com'},
    {name: 'Nadeem Malik', location: 'India', email: 'ali.malik@gmail.com'},
    {name: 'Jake Paul', location: 'New York, USA', email: 'jake.paul@jp.com'},
    {name: 'John Winston', location: 'London, England', email: 'jw.6355@jp.com'},
  ];
}
