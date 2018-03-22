// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import PscToggle from '../shared/pcsToggle/pcsToggle';
import DeviceSimulationService from '../../services/deviceSimulationService';
import lang from '../../common/lang';
import Config from '../../common/config';
import Spinner from '../spinner/spinner';
import CloseIconSvg from '../../assets/icons/X.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as actions from '../../actions';
import PlatformSettings from './platformSettings';

import './settingFlyout.css';

// Helper objects for choosing the correct label for the simulation service toggle input
const desiredSimulationLabel = {
  true: lang.START,
  false: lang.STOP
};

const currSimulationLabel = {
  true: lang.RUNNING,
  false: lang.STOPPED
};

class SettingFlyout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currSimulationState: undefined,
      desiredSimulationState: undefined,
      loading: false,
      logoFile: undefined,
      applicationName: undefined
    };

    this.eTag = new BehaviorSubject(undefined);
    this.unmount = new Subject();
    this.eTagStream = this.eTag.filter(_ => _);
  }

  componentDidMount() {
    Observable.fromPromise(DeviceSimulationService.getSimulatedDevices())
      .takeUntil(this.unmount)
      .subscribe(
        ({ Etag, Enabled }) => {
          this.setState({ 
            currSimulationState: Enabled,
            desiredSimulationState: Enabled
          });
          this.eTag.next(Etag);
        },
        err => this.eTag.error(err)
      );
  }

  componentWillUnmount() {
    this.unmount.next(undefined);
    this.unmount.unsubscribe();
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  onNameChange = (name) => {
    this.setState({
      applicationName: name
    });
  };
  
  onUpload = (file) => {
    this.setState({
      logoFile: file
    });
  };

  apply = () => {
    const { logoFile, applicationName } = this.state;
    if(logoFile || applicationName) {
      var headers = {};
      if(applicationName) {
        headers.name = applicationName
      }
      if(logoFile) {
        headers.contentType = logoFile.type;
      } else {
        headers['Content-Type'] = "text/plain";
      }
      this.props.actions.setLogo(logoFile, headers);
    } 
    if(this.state.desiredSimulationState !== this.state.currSimulationState) {
      Observable
       .of(this.state.desiredSimulationState)
       .do(_ => this.setState({ loading: true}))
       .zip(this.eTagStream, (Enabled, Etag) => ({ Etag, Enabled }))
       .flatMap(({ Etag, Enabled }) => DeviceSimulationService.toggleSimulation(Etag, Enabled))
       .takeUntil(this.unmount)
       .subscribe(
         () => this.props.onClose(),
         err => console.error(err)
       );
     } else {
       this.props.onClose();
     }
  };

  render() {
    const { currSimulationState, desiredSimulationState, loading, logoFile, applicationName } = this.state;
    const stillInitializing = currSimulationState === undefined;
    const hasChanged = !stillInitializing && (currSimulationState !== desiredSimulationState 
      || logoFile !== undefined || applicationName !== undefined);

    const simulationLabel = hasChanged ? desiredSimulationLabel[desiredSimulationState] : currSimulationLabel[currSimulationState];

    return (
      <div className="setting-workflow-container">
        <div className="setting-section">
          <div className="section-header">{ `${lang.VERSION} ${Config.VERSION}` }</div>
        </div>
        <div className="setting-section">
          <div className="section-header">{ lang.SIMULATION_DATA }</div>
          <div className="section-description">{ lang.SIMULATION_SETTINGS_DESC }</div>
          <div className="section-input-group">
            <PscToggle
              name="desiredSimulationState" 
              value={desiredSimulationState}
              disabled={stillInitializing}
              onChange={this.onChange} />
            <label>{ stillInitializing ? lang.LOADING : simulationLabel }</label>
          </div>
        </div>
        <PlatformSettings onNameChange={this.onNameChange} onUpload={this.onUpload} />
        <div className="btn-container">
          <PcsBtn svg={CloseIconSvg} onClick={this.props.onClose}>{hasChanged ? lang.CANCEL : lang.CLOSE }</PcsBtn>
          { !loading && hasChanged && <PcsBtn onClick={this.apply}>{ lang.APPLY }</PcsBtn> }
          { loading && <Spinner size='small' /> }
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(undefined, mapDispatchToProps)(SettingFlyout);
