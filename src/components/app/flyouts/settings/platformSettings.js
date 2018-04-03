// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { Btn, FormControl, Indicator, Svg, FileInput } from 'components/shared';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Flyout from 'components/shared/flyout';

import './platformSettings.css';
import { svgs } from 'utilities';
const Section = Flyout.Section;

class PlatformSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentLogo: this.props.logo,
      currentApplicationName: this.props.name,
      stillInitializing: false,
      edit: false,
      previewLogo: this.props.logo,
      newLogoName: undefined,
      logoIsDefault: this.props.logoIsDefault,
      validating: false,
      isValidFile: false
    }

    const { t } = this.props;
    //this.props.actions.getLogo();
  }

  componentWillReceiveProps(nextProps) {
    const { application } = nextProps;
    if (!_.isEqual(application, this.props.application)) {
      this.setState({
        currentLogo: application.logo,
        currentApplicationName: application.name
      });
    }
    if (this.state.stillInitializing) {
      this.setState({
        stillInitializing: false
      });
    }
  }

  renderSvgLogo = (logo) => {
    return (
      <Svg path={logo} className="logo-svg" />
    );
  };

  render() {
    const fileName = this.state.newLogoName
    const { t } = this.props;
    const { logoIsDefault, validating, isValidFile } = this.state;

    return (
      <Section.Container collapsable={true} className="setting-section">
        <Section.Header>{t('platformSettings.nameAndLogo')}</Section.Header>
        <Section.Content>{t('platformSettings.nameLogoDescription')}</Section.Content>
        {this.state.stillInitializing ?
          <Indicator size='medium' />
          :
          <Section.Content>
            {this.state.edit ?
              validating ?
                <div className="upload-logo-name-container">
                  <Indicator size='small' />
                </div>
                :
                <div className="upload-logo-name-container">
                  <div className="upload-logo-container">
                    <div className="image-preview">
                      {logoIsDefault ?
                        this.renderSvgLogo(this.state.currentLogo)
                        :
                        <img className="preview-logo" src={this.state.previewLogo} alt={t('platformSettings.previewLogo')} />
                      }
                    </div>
                    <div className="replace-logo">{t('platformSettings.replaceLogo')}</div>
                    <div className="upload-btn-container">
                      <FileInput className="upload-button" classForLabel="description" isEdit={true} onChange={this.onUpload} accept=".jpg, .jpeg, .png, .svg" label={t('platformSettings.upload')} t={t}></FileInput>
                      <div className="file-upload-feedback"> {isValidFile ?
                        <Svg className="checkmark-img" path={svgs.checkmark} alt={t('platformSettings.checkmark')} />
                        :
                        fileName && <Svg className="invalid-file-x" path={svgs.x} alt={t('platformSettings.error')} />
                      } </div>
                      <div className="file-name">{fileName}</div>
                    </div>
                      {!isValidFile && fileName &&
                        <div className="upload-error-message">
                          <Svg className="upload-error-asterisk" path={svgs.error} alt={t('platformSettings.error')} />
                          {t('platformSettings.uploadError')}
                        </div>}
                    <Section.Content className="platform-section-description show-line-breaks">{t('platformSettings.logoDescription')}</Section.Content>
                  </div>
                  <Section.Content className="name-input-container">
                    <div className="section-subtitle">{t('platformSettings.applicationName')}</div>
                    <FormControl type="text" className="name-input long" classForLabel="description"
                      isEdit={true} placeholder={this.state.currentApplicationName} onChange={this.onNameChange} />
                  </Section.Content>
                </div>
              :
              <div>
                <div className="current-logo-container">
                  <div className="current-logo-name">
                    <div className="current-logo">
                      {logoIsDefault ?
                        this.renderSvgLogo(this.state.currentLogo)
                        : <img className="current-logo" src={this.state.currentLogo} alt={t('platformSettings.currentLogo')} />
                      }
                    </div>
                    <div className="name-container">{this.state.currentApplicationName}</div>
                  </div>
                  <div className="edit-button-div">
                    <Btn svg={svgs.edit} onClick={this.enableEdit} className="edit-name-button">{t('platformSettings.edit')}</Btn>
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
    var { name, value } = e.target;
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
    if (file !== undefined && this.isValidLogoFile(file)) {
      this.setState({
        newLogoName: file.name,
        previewLogo: URL.createObjectURL(file),
        logoIsDefault: false,
        validating: false,
        isValidFile: true
      });
    } else {
      this.setState({
        previewLogo: this.state.currentLogo,
        newLogoName: undefined,
        logoIsDefault: this.props.logoIsDefault,
        validating: false,
        isValidFile: false
      });
      if (file !== undefined) {
        this.setState({
          newLogoName: file.name
        });
        file = undefined;
      }
    }
    this.props.onUpload(file);
  };

  isValidLogoFile(file) {
    var fileName = file.name;
    var nameParts = fileName.split('.');
    var length = nameParts.length;
    var lastSection = nameParts[length - 1];
    var validExtensions = ['png', 'jpeg', 'jpg', 'svg'];
    for (var i = 0; i < validExtensions.length; i++) {
      if (lastSection == validExtensions[i]) {
        return true;
      }
    }
    return false;
  }
}

// const mapStateToProps = state => {
//   return {
//     application: state.applicationReducer.application
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     actions: bindActionCreators(actions, dispatch)
//   };
// };
export default (PlatformSettings);

//export default connect(mapStateToProps, mapDispatchToProps)(PlatformSettings);
