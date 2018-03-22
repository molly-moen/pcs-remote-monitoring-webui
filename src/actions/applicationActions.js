// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import ApiService from '../common/apiService';
import { loadFailed } from './ajaxStatusActions';

export const getLogo = () => {
  return dispatch => {
    return ApiService.getLogo()
      .then(response => {
        dispatch({
          type: types.GET_LOGO,
          response
        });
      })
      .catch(error => {
        throw error;
      });
  };
}


export const setLogo = (logoFile, headers) => {
  return dispatch => {
    return ApiService.setLogo(logoFile, headers)
      .then(
      response =>
        dispatch({
          type: types.SET_LOGO,
          response
        }),
      error => dispatch(loadFailed(error))
      );
  }
}