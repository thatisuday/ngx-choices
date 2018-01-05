import { NGX_CHOICES_CONF } from './ngx-choices.interface';
import { NGX_CHOICES_MODE } from './ngx-choices.enum';

export const REGEX_TYPES = {
    ALL: /.+/,
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    LETTERS_ONLY: /^[a-zA-Z]+$/,
    INT_ONLY: /^\d+$/,
    FLOAT_ONLY: /^-?\d*(\.\d+)?$/
};

export const KEY_CODES = {
    backspace: 8,
    enter: 13,
    up: 38,
    down: 40
};

export const DEFAULT_CONF: NGX_CHOICES_CONF = {
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