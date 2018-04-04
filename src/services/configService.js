// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from './httpClient';
import { toDeviceGroupsModel } from './models';

const ENDPOINT = Config.serviceUrls.config;

/** Contains methods for calling the config service */
export class ConfigService {

  /** Returns a the account's device groups */
  static getDeviceGroups() {
    return HttpClient.get(`${ENDPOINT}devicegroups`)
      .map(toDeviceGroupsModel);
  }

  static getLogo() {
    var options = {};
    options.responseType = 'blob';
    return HttpClient.get(`${ENDPOINT}solution-settings/logo`, options, true, false)
    .map((response) =>  ConfigService.prepareLogoResponse(response));
  }

  static setLogo(logo, header) {
    var options = {};
    options.headers = header;
    options.responseType = 'blob';
    if(!logo) {
      logo = '';
    }
    return HttpClient.put(`${ENDPOINT}solution-settings/logo`, logo, options, true, false)
    .map((response) =>  ConfigService.prepareLogoResponse(response));
  }

  static prepareLogoResponse(response) {
    var returnObj = {};
    var xhr = response.xhr;
    var isDefault = xhr.getResponseHeader("IsDefault");
    if(isDefault.toLowerCase() === "false") {
      var appName = xhr.getResponseHeader("Name");
      if(appName) {
        returnObj['name'] = appName;
      }
      var blob = response.response;
      if(blob && blob.size > 0) {
        returnObj['logo'] = URL.createObjectURL(blob);
        var responseType = blob.type;
      }
    }
    return returnObj;
  }
}
