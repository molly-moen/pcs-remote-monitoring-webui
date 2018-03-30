// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { Btn, FormControl, Indicator } from 'components/shared';
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
      previewLogo: this.props.logo
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

  render() {
    const fileName = this.state.logoFile ? this.state.logoFile.name : ''
    const { t } = this.props;
    return (
      <Section.Container collapsable={true} className="setting-section">
        <Section.Header>{t('platformSettings.nameAndLogo')}</Section.Header>
        <Section.Content>{t('platformSettings.nameLogoDescription')}</Section.Content>
        {this.state.stillInitializing ?
          <Indicator size='medium' />
          :
          <Section.Content>
            {this.state.edit ?
              <div>
                <div className="upload-logo-container">
                  <div className="image-preview">
                    <img className="preview-logo" src={this.state.previewLogo} alt={t('platformSettings.previewLogo')} />
                  </div>
                  <div className="replace-logo">{t('platformSettings.replaceLogo')}</div>
                  <div className="upload-btn-container">
                    <FormControl type="file" className="upload-btn" classForLabel="description" isEdit={true} onChange={this.onUpload} accept=".jpg, .jpeg, .png, .svg" label={t('platformSettings.upload')} t={t}></FormControl>
                    <span className="file-upload-feedback"> {this.state.logoFile && <img className="checkmark-img" src={svgs.CheckmarkSvg} alt={t('platformSettings.checkmark')} />} </span>
                    <span className="file-name-span">{fileName}</span>
                  </div>
                  <div className="platform-section-description show-line-breaks">{t('platformSettings.logoDescription')}</div>
                </div>
                <div className="name-container">
                  <div className="section-subtitle">{t('platformSettings.applicationName')}</div>
                  <FormControl type="text" className="name-input" classForLabel="description"
                    isEdit={true} placeholder={this.state.currentApplicationName} onChange={this.onNameChange} />
                </div>
              </div>
              :
              <div>
                <div className="current-logo-container">
                  <span className="current-image-span">
                    <img className="current-logo" src={this.state.currentLogo} alt={t('platformSettings.currentLogo')} />
                  </span>
                  <span className="name-container">{this.state.currentApplicationName}</span>
                  <Btn svg={svgs.edit} onClick={this.enableEdit} className="edit-name-button">{t('platformSettings.edit')}</Btn>
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
    var {name, value} = e.target;
    if (value.length === 0) {
      value = undefined;
    }
    this.props.onNameChange(value);
  };

  onUpload = (e) => {
    var file = e.target.files[0]
    if (file == undefined) {
      this.setState({
        previewLogo: this.state.currentLogo
      });
    } else {
      this.setState({
        previewLogo:URL.createObjectURL(file)
      });
    }
    this.props.onUpload(file);
  };
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
