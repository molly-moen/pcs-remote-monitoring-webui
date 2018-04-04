// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  redux as appRedux,
  getTheme,
  getVersion,
  getLogo,
  isDefaultLogo,
  getName,
  getReleaseNotes
} from 'store/reducers/appReducer';
import { Settings } from './settings';
import { epics as appEpics } from 'store/reducers/appReducer';

const mapStateToProps = state => ({
  theme: getTheme(state),
  version: getVersion(state),
  logo: getLogo(state),
  name: getName(state),
  isDefaultLogo: isDefaultLogo(state),
  releaseNotes: getReleaseNotes(state)
});

const mapDispatchToProps = dispatch => ({
  changeTheme: theme => dispatch(appRedux.actions.changeTheme(theme)),
  setLogo: (logo, headers) => dispatch(appEpics.actions.setLogo({logo, headers}))
});

export const SettingsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Settings));
