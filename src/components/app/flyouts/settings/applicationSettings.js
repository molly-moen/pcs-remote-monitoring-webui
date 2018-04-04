// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { Btn, FormControl, Indicator, Svg, FileInput } from 'components/shared';
import _ from 'lodash';
import Flyout from 'components/shared/flyout';

import './applicationSettings.css';
import { svgs } from 'utilities';
const Section = Flyout.Section;
const AcceptedFileTypes = '.jpg, .jpeg, .png, .svg';

class ApplicationSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentLogo: this.props.logo,
      currentApplicationName: this.props.name,
      initializing: false,
      edit: false,
      previewLogo: this.props.logo,
      newLogoName: undefined,
      isDefaultLogo: this.props.isDefaultLogo,
      validating: false,
      isValidFile: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { application } = nextProps;
    if (!_.isEqual(application, this.props.application)) {
      this.setState({
        currentLogo: application.logo,
        currentApplicationName: application.name
      });
    }
    if (this.state.initializing) {
      this.setState({
        initializing: false
      });
    }
  }

  renderSvgLogo = (logo) => {
    return (
      <Svg path={logo} className="logo-svg" />
    );
  };

  renderUploadContainer = () => {
    const fileName = this.state.newLogoName
    const { t } = this.props;
    const { isDefaultLogo, isValidFile } = this.state;
    const fileNameClass = isValidFile ? 'file-name-valid' : 'file-name-invalid';
    return (
      <div className="upload-logo-name-container">
        <div className="upload-logo-container">
          <div className="image-preview">
            {isDefaultLogo
              ? this.renderSvgLogo(this.state.currentLogo)
              : <img className="logo-img" src={this.state.previewLogo} alt={t('applicationSettings.previewLogo')} />}
          </div>
          <div className="replace-logo">{t('applicationSettings.replaceLogo')}</div>
          <div className="upload-btn-container">
            <FileInput className="upload-button" classForLabel="description" isEdit={true} onChange={this.onUpload}
              accept={AcceptedFileTypes} label={t('applicationSettings.upload')} t={t} />
            <div className="file-upload-feedback">
              {isValidFile
                ? <Svg className="checkmark" path={svgs.checkmark} alt={t('applicationSettings.checkmark')} />
                : fileName && <Svg className="invalid-file-x" path={svgs.x} alt={t('applicationSettings.error')} />}
            </div>
            <div className={fileNameClass}>{fileName}</div>
          </div>
          {!isValidFile && fileName &&
            <div className="upload-error-message">
              <Svg className="upload-error-asterisk" path={svgs.error} alt={t('applicationSettings.error')} />
              {t('applicationSettings.uploadError')}
            </div>
          }
          <Section.Content className="platform-section-description show-line-breaks">{t('applicationSettings.logoDescription')}</Section.Content>
        </div>
        <Section.Content className="name-input-container">
          <div className="section-subtitle">{t('applicationSettings.applicationName')}</div>
          <FormControl type="text" className="name-input long" classForLabel="description"
            isEdit={true} placeholder={this.state.currentApplicationName} onChange={this.onNameChange} />
        </Section.Content>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    const { isDefaultLogo, validating } = this.state;
    return (
      <Section.Container collapsable={true} className="setting-section">
        <Section.Header>{t('applicationSettings.nameAndLogo')}</Section.Header>
        <Section.Content>{t('applicationSettings.nameLogoDescription')}</Section.Content>
        {this.state.initializing
          ? <Indicator size='medium' />
          : <Section.Content>
            {this.state.edit
              ? validating
                ? <div className="upload-logo-name-container">
                  <Indicator size='small' />
                </div>
                : this.renderUploadContainer()
              : <div>
                <div className="current-logo-container">
                  <div className="current-logo-name">
                    <div className="current-logo">
                      {isDefaultLogo
                        ? this.renderSvgLogo(this.state.currentLogo)
                        : <img className="current-logo" src={this.state.currentLogo} alt={t('applicationSettings.currentLogo')} />
                      }
                    </div>
                    <div className="name-container">{this.state.currentApplicationName}</div>
                  </div>
                  <div className="edit-button-div">
                    <Btn svg={svgs.edit} onClick={this.enableEdit} className="edit-button">{t('applicationSettings.edit')}</Btn>
                  </div>
                </div>
              </div>
            }
          </Section.Content>
        }
      </Section.Container>
    );
  }

  enableEdit = () => {
    this.setState({
      edit: true
    });
  }

  onNameChange = (e) => {
    var { value } = e.target;
    if (value.length === 0) {
      value = undefined;
    }
    this.props.onNameChange(value);
  };

  onUpload = (e) => {
    var file = e.target.files[0];
    this.setState({
      validating: true,
      validFile: false
    });
    if (this.isValidLogoFile(file)) {
      this.setState({
        newLogoName: file.name,
        previewLogo: URL.createObjectURL(file),
        isDefaultLogo: false,
        validating: false,
        isValidFile: true
      });
    } else {
      this.setState({
        previewLogo: this.state.currentLogo,
        newLogoName: file !== undefined ? file.name : undefined,
        isDefaultLogo: this.props.isDefaultLogo,
        validating: false,
        isValidFile: false
      });
      file = undefined;
    }
    this.props.onUpload(file);
  };

  /** Verify if given file is of type .png, .jpeg, .jpg, or .svg */
  isValidLogoFile(file) {
    if (!file) {
      return false;
    }
    var nameParts = file.name.split('.');
    var length = nameParts.length;
    var lastSection = nameParts[length - 1];
    var validExtensions = ['png', 'jpeg', 'jpg', 'svg'];
    for (var i = 0; i < validExtensions.length; i++) {
      if (lastSection === validExtensions[i]) {
        return true;
      }
    }
    return false;
  }
}

export default (ApplicationSettings);
