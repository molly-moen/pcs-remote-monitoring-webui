// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

export const toGitHubModel = (response = {}) =>
  reshape(response[0], {
    'name': 'version',
    'htmlUrl': 'releaseNotesUrl'
  });
