// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  redux as appRedux,
  getLogo,
  getName,
} from 'store/reducers/appReducer';
import { Navigation } from './navigation';

const mapStateToProps = state => ({
  logo: getLogo(state),
  name: getName(state)
});

const NavigationContainer = translate()(connect(mapStateToProps)(Navigation));

export default NavigationContainer;
