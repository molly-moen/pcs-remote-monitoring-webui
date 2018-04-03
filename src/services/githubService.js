// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from './httpClient';


const ENDPOINT = Config.serviceUrls.githubReleases;

export const GitHubService {
  static getReleaseInfo() {
    return HttpClient.get(ENDPOINT)
    .map(toGitHubModel);
  }
}
