// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

import lang from '../common/lang';
import ContosoIcon from '../assets/icons/Contoso.svg';

const applicationReducer = (state = initialState.application, action) => {
  switch (action.type) {
    case types.SET_LOGO:
    case types.GET_LOGO:
      return {
        ...state,
        application: {
            logo: action.response.logo ? action.response.logo : ContosoIcon,
            name: action.response.name ? action.response.name : lang.CONTOSO
        }
      };

    default:
      return state;
  }
};

export default applicationReducer;