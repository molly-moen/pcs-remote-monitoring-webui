// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import Flyout from 'components/shared/flyout';
import { Btn, Indicator, ToggleBtn } from 'components/shared';
import { DeviceSimulationService } from 'services';

import { svgs } from 'utilities';
import './settings.css';
import ApplicationSettings from 'components/app/flyouts/settings/applicationSettings';

const Section = Flyout.Section;

export class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currSimulationState: undefined,
      desiredSimulationState: undefined,
      logoFile: undefined,
      applicationName: undefined,
      loading: false
    };

    this.eTag = new BehaviorSubject(undefined);
    this.unmount = new Subject();
    this.eTagStream = this.eTag.filter(_ => _);
    const { t } = this.props;

    // Helper objects for choosing the correct label for the simulation service toggle input
    this.desiredSimulationLabel = {
      true: t('settingsFlyout.start'),
      false: t('settingsFlyout.stop')
    };
    this.currSimulationLabel = {
      true: t('settingsFlyout.flowing'),
      false: t('settingsFlyout.stopped')
    };
  }

  componentDidMount() {
    DeviceSimulationService.getSimulatedDevices()
      .takeUntil(this.unmount)
      .subscribe(
        ({ etag, enabled }) => {
          this.setState({
            currSimulationState: enabled,
            desiredSimulationState: enabled
          });
          this.eTag.next(etag);
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

  apply = () => {
    const { logoFile, applicationName } = this.state;
    if (logoFile || applicationName) {
      var headers = {};
      if (applicationName) {
        headers.name = applicationName
      }
      if (logoFile) {
        headers['Content-Type'] = logoFile.type;
      } else {
        headers['Content-Type'] = "text/plain";
      }
      this.props.setLogo(logoFile, headers);
    }
    Observable
      .of(this.state.desiredSimulationState)
      .do(_ => this.setState({ loading: true }))
      .zip(this.eTagStream, (Enabled, Etag) => ({ Etag, Enabled }))
      .flatMap(({ Etag, Enabled }) => DeviceSimulationService.toggleSimulation(Etag, Enabled))
      .takeUntil(this.unmount)
      .subscribe(
        () => this.props.onClose(),
        err => console.error(err)
      );
  };

  onUpload = (file) => {
    this.setState({
      logoFile: file
    });
  };

  onNameChange = (name) => {
    this.setState({
      applicationName: name
    });
  };

  render() {
    const { t, onClose, theme, changeTheme, version, releaseNotes } = this.props;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const { currSimulationState, desiredSimulationState, loading, logoFile, applicationName } = this.state;
    const stillInitializing = currSimulationState === undefined;
    const hasChanged = !stillInitializing && (currSimulationState !== desiredSimulationState
      || logoFile !== undefined || applicationName !== undefined);
    const hasSimulationChanged = !stillInitializing && (currSimulationState !== desiredSimulationState)
    const simulationLabel = hasSimulationChanged ? this.desiredSimulationLabel[desiredSimulationState] : this.currSimulationLabel[currSimulationState];

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t('settingsFlyout.title')}</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content className="settings-workflow-container">
          <Section.Container collapsable={false} className="app-version">
            <Section.Header>{t('settingsFlyout.version', { version })}</Section.Header>
            <Section.Content className="release-notes"><a href={releaseNotes} target="_blank">{t('settingsFlyout.viewRelNotes')}</a></Section.Content>
          </Section.Container>
          <Section.Container collapsable={true} className="simulation-toggle-container">
            <Section.Header>{t('settingsFlyout.simulationData')} </Section.Header>
            <Section.Content className="simulation-description">
              {t('settingsFlyout.simulationDescription')}
              <div className="simulation-toggle">
                <ToggleBtn
                  className="simulation-toggle-button"
                  name="desiredSimulationState"
                  value={desiredSimulationState}
                  disabled={stillInitializing}
                  onChange={this.onChange} />
                <div className="simulation-toggle-label">
                  {stillInitializing ? t('settingsFlyout.loading') : simulationLabel}
                </div>
              </div>
            </Section.Content>
          </Section.Container>
          <Section.Container>
            <Section.Header>{t('settingsFlyout.theme')}</Section.Header>
            <Section.Content>
              {t('settingsFlyout.changeTheme')}
              <button onClick={() => changeTheme(nextTheme)} className="toggle-theme-btn">
                {t('settingsFlyout.switchTheme', { nextTheme })}
              </button>
            </Section.Content>
          </Section.Container>
          <ApplicationSettings onUpload={this.onUpload} onNameChange={this.onNameChange} {...this.props} />
          <div className="btn-container">
            {!loading && hasChanged && <Btn onClick={this.apply} className="apply-button">{t('settingsFlyout.apply')}</Btn>}
            <Btn svg={svgs.x} onClick={onClose} className="close-button">{hasChanged ? t('settingsFlyout.cancel') : t('settingsFlyout.close')}</Btn>
            {loading && <Indicator size='small' />}
          </div>
        </Flyout.Content>

      </Flyout.Container>
    );
  }
}
