# ngx-choices
Angular 4+ typehead to search and select multiple tags.

[![preview](https://i.imgur.com/LIvj1hY.png)](https://thatisuday.github.io/ngx-choices/dist/)

[![npm](https://img.shields.io/npm/dt/ngx-choices.svg?style=flat-square)](https://www.npmjs.com/package/ngx-choices)
[![npm](https://img.shields.io/npm/v/ngx-choices.svg?style=flat-square)](https://www.npmjs.com/package/ngx-choices)
[![David](https://img.shields.io/david/thatisuday/ngx-choices.svg?style=flat-square)](https://www.npmjs.com/package/ngx-choices)
[![preview](https://img.shields.io/badge/preview-click_here-green.svg?style=flat-square)](https://thatisuday.github.io/ngx-choices/dist/)

# Peer dependencies
- "@angular/core": ">4.3.0",
- "@angular/forms": ">4.3.0",
- "@angular/common": ">4.3.0",

# Installation

```bash
npm i -S ngx-choices@latest
```

# Import module
```ts
import { NgxChoicesModule } from 'ngx-choices';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChoicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

# Use cases
## Inside form as form control
```html
<div class="container">
	<form #f="ngForm" (ngSubmit)="submit(f)">
		<div class="form-group">
			<label>Enter email address(es)</label>
			<ngx-choices name="choices" [items]="items" [config]="config" [(ngModel)]="choices" required multiple></ngx-choices>
		</div>      

		<button type="submit" [disabled]="!f.valid">Submit</button>
	</form>
</div>
```

## Independent component
```html
<ngx-choices name="choices" [items]="items" [config]="config" (onChange)="changed($event)" (onType)="typed($event)" (onError)="erred($event)" multiple></ngx-choices>
```

# Nomenclature
### items (binding)
Dropdown items to choose **choice** from.

### config (binding)
`ngx-choices` configuration object of type `NGX_CHOICES_CONF`.

### onChange (event)
When user adds or removes choices. Emits changed values.

## onType (event)
When user types inside input box to search from items or to add custom value.   Emits typed value.

## onError (event)
Sends alert notification occured during user interactions.

## multiple (attr)
User will be able to select multiple choices.

# interface
```ts
interface NGX_CHOICES_CONF {
    // [import enum `NGX_CHOICES_MODE` from ngx-choices]
    // mode to run ngx-choices in (default NGX_CHOICES_MODE.NORMAL) 
    // NGX_CHOICES_MODE.NORMAL mode -> select plain text for values
    // NGX_CHOICES_MODE.ABSTRACT mode -> select objects for values, will not accept for custom user input
    mode?: NGX_CHOICES_MODE;

    // key in items provided from which value will be selected (default id)
    // critical for validation and validating duplicate
    // no need in case of `filter` is false
    value?: string;

    // key in `items` provided or filtered results to display as selected choices (default null)
    label?: string;

    // extra field to be disabled in filtered results (default username)
    meta?: string;

    // image field to pick avatar image (default null)
    avatar?: string;

    // alternative avatar image url if avatar image is not found in the item (default null)
    avatar_url?: string;

    // allow only unique value (default true)
    unique?: boolean;

    // should ngx-choices filter items (default false)
    // items must be provided in order to filter choices
    filter?: boolean;

    // should ngx-choices filter remote items (default null)
    // if provided, this will not use items provided ngx-choices using `items` binding
    remoteFilter?: {
        // api url endpoint to fetch data
        // by default, `q` query parameter used to send user type query value
        url: string;
        
        // additional query parameters to be sent
        queryParams?: HttpParams;

        // addtional headers to be sent
        headers?: HttpHeaders;

        // search query parameter (default q)
        searchParam?: string;
    };

    // placeholder text of user input box (default 'Type to enter value')
    placeholder?: string;

    // [import RegExp preset `REGEX_TYPES` from ngx-choices]
    // regular expression to match choice value (default REGEX_TYPES.ALL)
    pattern?: RegExp;

    // minimum length of user input value (default 1)
    minLength?: number;

    // maximum length of user input value (default 100)
    maxLength?: number;

    // maximum number of values user can choose (default 100)
    maxSelections?: number;

    // hide input on maximum selections (default false)
    hideInputOnMaxSelections?: boolean;

    // accept user input value (default true)
    // will not work in case of abstract `mode`
    acceptUserInput?: boolean;
    
    // css styles
    style?: {
        // min-width of input box
        minInputWidth?: string;

        // selected value element properties
        choiceElementHeight?: string;
        choiceBorderRadius?: string;
    }
}

interface NGX_CHOICES_ERROR {
    type: string;
    msg: string;
}
```


# enum
```ts
enum NGX_CHOICES_MODE {
    NORMAL,
    ABSTRACT
}
```

# constant
```ts
const REGEX_TYPES = {
    ALL: /.+/,
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    LETTERS_ONLY: /^[a-zA-Z]+$/,
    INT_ONLY: /^\d+$/,
    FLOAT_ONLY: /^-?\d*(\.\d+)?$/
};

const KEY_CODES = {
    backspace: 8,
    enter: 13,
    up: 38,
    down: 40
};

const DEFAULT_CONF: NGX_CHOICES_CONF = {
    mode: NGX_CHOICES_MODE.NORMAL,
    value: 'id',
    label: 'name',
    meta: null,
    avatar: null,
    avatar_url: null,
    unique: true,
    filter: false,
    remoteFilter: null,
    placeholder: 'Type to enter value',
    pattern: REGEX_TYPES.ALL,
    minLength: 1,
    maxLength: 100,
    maxSelections: 100,
    hideInputOnMaxSelections: false,
    acceptUserInput: true,
    style: {
      minInputWidth: '150px',
      choiceElementHeight: '22px',
      choiceBorderRadius: '12px',
    }
};
```

# Copyrights
Integrate or build upon it for free in your personal or commercial projects. Don't republish, redistribute or sell "as-is". We would appreciate if you contact us at `thatisuday@gmail.com` (if you are a business, institution or organization) so that we can mention your name in **users list** on this page.


