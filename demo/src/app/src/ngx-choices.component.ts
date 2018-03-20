import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, ElementRef, Renderer2, ViewChild, Input, Output, HostBinding, Attribute, HostListener, forwardRef, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import _ from 'lodash';
import Fuse from 'fuse-js-next';

import { REGEX_TYPES, KEY_CODES, DEFAULT_CONF } from './ngx-choices.constants';
import { NGX_CHOICES_CONF, NGX_CHOICES_ERROR } from './ngx-choices.interface';
import { NGX_CHOICES_MODE } from './ngx-choices.enum';

@Component({
  selector: 'ngx-choices',
  templateUrl: './ngx-choices.component.html',
  styleUrls: ['./ngx-choices.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxChoicesComponent),
      multi: true
    }
  ]
})
export class NgxChoicesComponent implements OnInit, OnChanges, ControlValueAccessor{
  // make enum public
  public _NGX_CHOICES_MODE = NGX_CHOICES_MODE;

  // input DOM element
  @ViewChild('input') inputElem: ElementRef;

  // input form control
  inputCtrl: FormControl = new FormControl();

  // set disabled state
  @HostBinding('class.__disabled') disabled: boolean = false;
  
  // final configuration
  config: NGX_CHOICES_CONF = {};

  // is component in focus
  focused: boolean = false;
  
  // selected values
  values: Array<any> = [];

  // search items
  @Input() items: any = [];

  // filtered items
  filteredItems: any = [];

  // user specified configuration
  @Input('config') userConfig: NGX_CHOICES_CONF = {};

  // emit on change event
  @Output() onChange = new EventEmitter<any>();
  
  // emit on query type event
  @Output() onType = new EventEmitter<any>();
  
  // emit errors
  @Output() onError = new EventEmitter<NGX_CHOICES_ERROR>();

  // fuse search
  fuse: Fuse = null;

  // remote search loading
  loading: boolean = false;

  // item selection index
  highlightedItem: number = 0;
  
  /*****************************************************/

  // get input value
  get inputValue(): string {
    return this.inputCtrl.value;
  }

  // set input value
  set inputValue(value) {
    this.inputCtrl.setValue(value);
  }

  // is input valid
  get isInputValid(): boolean {
    return  this.inputValue                                               && 
            this.inputCtrl.valid                                          &&
            this.inputValue.length >= this.config.minLength               &&
            this.inputValue.length <= this.config.maxLength               
    ;
  }

  // maximum selections reached
  get isAtMaxSelections(): boolean {
    return (this.values.length == this.config.maxSelections) || (this.isSingleSelector && this.values.length >= 1);
  }

  // is single selector
  @HostBinding('class.__singular')
  get isSingleSelector(): boolean {
    return this.multiple == null;
  }

  // is item selected (in values)
  isItemSelected(item) {
    if(this.isAbstractMode) {
      return !!_.find(this.values, value => item[this.config.value] == value[this.config.value]);
    }
    else {
      return !!_.find(this.values, value => item[this.config.value] == value);
    }
  }
  
  // is choices filterable
  get isFilterable(): boolean {
    return (this.config.filter && this.items && this.items.length > 0) || !!this.config.remoteFilter;
  }

  // should items selection dropdown open
  @HostBinding('class.__dropdown_open') 
  get isDropdownOpened(): boolean {
    return !this.disabled && this.focused && this.config.filter && this.filteredItems.length > 0 && !this.isAtMaxSelections;
  }

  // is abstract mode
  get isAbstractMode(): boolean {
    return this.config.mode == NGX_CHOICES_MODE.ABSTRACT;
  }

  /*****************************************************/

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    @Attribute('multiple') private multiple: string
  ) {}

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    // update configuration
    if(changes.userConfig){
      this.configInit(changes.userConfig.currentValue);
    }

    // initialize filtered items to items
    this.resetFilteredItems();

    // reinitialize fuse search
    this.fuse = (this.items) ? new Fuse(this.items, {keys: [this.config.label, this.config.value]}) : null;
  }

  /*****************************************************/

  // listen to keydown event
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    // back button press
    if(event.keyCode == KEY_CODES.backspace && !this.inputValue){
      let removedValue = this.values.pop();

      // set removed value to input element (for edit)
      if(this.config.acceptUserInput && !this.isAbstractMode){
        this.inputValue = removedValue;
      }

      event.stopPropagation();
      return false;
    }

    // on enter press, add value to values
    if(event.keyCode == KEY_CODES.enter){
      if(this.isInputValid && this.config.acceptUserInput && !this.isAbstractMode){
        this.addValue(this.inputValue);
        event.stopPropagation();
        return false;
      }
    }
  }
  
  // listen click inside
  @HostListener('click', ['$event']) onClickInside(event) {
    this.focus();
  }

  // listen click outside
  @HostListener('document:click', ['$event']) onClickOutside(event) {
    const clickedInside = this.elem.nativeElement.contains(event.target);
    if(!clickedInside && !event.target.classList.contains('delete')) {
      this.blur();
    }
  }

  /*****************************************************/

  // init configuration
  configInit(newConfig: any = {}) {
    _.merge(this.config, DEFAULT_CONF, newConfig);
  }
  
  // focus component
  focus() {
    this.focused = true;
  }

  // blur component
  blur() {
    this.focused = false;
  }
  
  // focus input
  focusInput() {
    this.inputElem.nativeElement.focus();
  }
  
  // blur input
  blurInput() {
    this.inputElem.nativeElement.blur();
  }

  // add a value to selection
  addValue(value, propagateChanges: boolean = true){
    // if maximum selections reached, return
    if(this.isAtMaxSelections){
      let max = (this.isSingleSelector) ? `[1] choice` : `[${this.config.maxSelections}] choices`;
      this.onError.emit({type: 'MAX_SELECTIONS', msg: `Can not add more than ${max}.`});
      return;
    }
    
    // in abstract mode
    if(this.isAbstractMode) {
      // use only object value
      if(!_.isObject(value)) {
        this.onError.emit({type: 'INVALID_VALUE_TYPE', msg: 'In abstract mode, you can only add object. String value provided.'});
        return;
      }
    }

    // in normal mode
    if(!this.isAbstractMode) {
      // use only string value
      if(_.isObject(value)) {
        value = value[this.config.value];
      }
    }
    
    // if value is empty, return
    if(!value){
      this.onError.emit({type: 'EMPTY_VALUE', msg: `Trying to add empty choice or key [${this.config.value}] does not exist on choice object provided!`});
      return;
    }
    
    // check if value is acceptable (regexp check)
    if(this.isAbstractMode) {
      if(!this.config.pattern.test(value[this.config.value])) {
        this.onError.emit({type: 'REG_EXP_FAILED', msg: 'The choice you are trying to add is not valid as per provided regular expression!'});
        return;
      }
    }
    else {
      if(!this.config.pattern.test(value)) {
        this.onError.emit({type: 'REG_EXP_FAILED', msg: 'The choice you are trying to add is not valid as per provided regular expression!'});
        return;
      }
    }
    
    // check for unique values
    if(this.config.unique) {
      if(this.isAbstractMode) {
        if(!_.find(this.values, _value => _value[this.config.value] == value[this.config.value])){
          this.values = this.values.concat([value]);
        }
      }
      else{
        this.values = _.union(this.values, [value]);
      }
    }
    else {
      this.values.push(value);
    }

    // clear input
    this.inputValue = null;

    // reset filtered items
    this.resetFilteredItems();

    // send changes (form control)
    if(propagateChanges){
      this.emitChanges(this.values);
    }
  }

  // remove value from values
  removeValue(value, index) {
    // reset filtered items if input value is empty
    if(!this.inputValue){
      this.resetFilteredItems();
    }

    this.values.splice(index, 1);
    this.emitChanges(this.values);
  }
  
  // clicked on item
  itemClicked(item, event) {
    this.addValue(item);
    event.stopPropagation();
    return false;
  }

  // input query types
  onQueryType() {
    if(this.inputValue){
      this.filterItems(this.inputValue);
    }
    else{
      this.resetFilteredItems();
    }

    // emit onType event
    this.onType.emit(this.inputValue);
  }

  // filter items
  filterItems(query: string) {
    if(this.isFilterable) {
      if(this.config.remoteFilter){
        this.getRemoteItems(query);
      }
      else if(this.fuse) {
        // get filtered items from fuse
        this.filteredItems = this.fuse.search(this.inputValue);

        // emit error on no items found
        if(_.isEmpty(this.filteredItems)){
          this.onError.emit({type: 'EMPTY_FILTER_DATA', msg: `No matches found with query [${query}]`});
        }
      }
    }
  }

  // filter remote items
  getRemoteItems = _.debounce((query: string) => {
    // show loading spinner
    this.loading = true;

    // HTTP headers
    let headers = (this.config.remoteFilter.headers) ? this.config.remoteFilter.headers : new HttpHeaders();

    // HTTP url query params
    let params = (this.config.remoteFilter.queryParams) ? this.config.remoteFilter.queryParams : new HttpParams();
    params = params.append(this.config.remoteFilter.searchParam || 'q', query);
    
    // send HTTP request
    this.http.get(this.config.remoteFilter.url, { headers, params })
    .subscribe((data) => {
      if(_.isNil(data) || _.isEmpty(data)) {
        this.onError.emit({type: 'NO_REMOTE_DATA', msg: 'No remote data received.'});
      }
      else {
        this.filteredItems = data;
      }
    }, _.noop, () => this.loading = false);
  }, 300);

  // reset filter items to items
  resetFilteredItems() {
    if(this.config.remoteFilter){
      return this.filteredItems = [];
    }
    else {
      return this.filteredItems = (this.items) ? this.items : [];
    }
  }

  // emit onChange update
  emitChanges(values: any) {
    if(this.isSingleSelector) {
      values = _.head(values) || null;
    }


    this.propagateChange(values);
    this.onChange.emit(values);
  }

  /*****************************************************/

  // control value accessor methods
  propagateChange = (values: any) => {};
  writeValue(values: any): void {
    if(!_.isNil(values)) {
      if(_.isArray(values)) {
        values.forEach((value) => this.addValue(value, false));
      }
      else {
        this.addValue(values, false);
      }
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
