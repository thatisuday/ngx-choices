import { HttpParams, HttpHeaders } from "@angular/common/http";
import { NGX_CHOICES_MODE } from "./ngx-choices.enum";

export interface NGX_CHOICES_CONF {
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

export interface NGX_CHOICES_ERROR {
    type: string;
    msg: string;
}