// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from './httpClient';

const ENDPOINT = Config.serviceUrls.deviceSimulation;
/**
 * Contains methods for calling the device simulation microservice
 */
export class DeviceSimulationService {

  /**
   * Toggles simulation status
   */
  static toggleSimulation(Etag, Enabled) {
    return HttpClient.patch(`${ENDPOINT}simulations/1`, { Etag, Enabled });
  }

  /**
   * Get the list of running simulated devices
   */
  static getSimulatedDevices() {
    return HttpClient.get(`${ENDPOINT}simulations/1`);
  }
}
