// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import lang from '../../common/lang';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import EditInput from "../editInput/editInput";
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as actions from '../../actions';

import './platformSettings.css';
import CheckmarkSvg from '../../assets/icons/Checkmark.svg'
import EditSvg from '../../assets/icons/Edit.svg';
import Spinner from '../spinner/spinner';

class PlatformSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentLogo: this.props.application ? this.props.application.logo : undefined,
      currentApplicationName: this.props.application ? this.props.application.name : undefined,
      stillInitializing: true,
      editLogo: false,
      editName: false
    }

    this.props.actions.getLogo();
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
    return (
      <div className="setting-section">
        <div className="section-header">{lang.PLATFORM_SETTINGS}</div>
        <div className="platform-section-description">{lang.EDIT_LOGO_DESCRIPTION}</div>
        {this.state.stillInitializing ? 
        <Spinner size='medium'/>
        :
        <div>
        {this.state.editLogo ?
          <div className="upload-logo-container">
            <div className="section-subtitle">{lang.UPLOAD_LOGO_FILE}</div>
            <div className="upload-btn-container">
              <EditInput type="file" className="upload-btn" classForLabel="description" isEdit={true} onChange={this.onUpload} accept=".jpg, .jpeg, .png, .svg" label={lang.UPLOAD}></EditInput>
              <span className="file-upload-feedback"> {this.state.logoFile && <img className="checkmark-img" src={CheckmarkSvg} alt={lang.CHECKMARK} />} </span>
              <span className="file-name-span">{fileName}</span>
            </div>
            <div className="platform-section-description show-line-breaks">{lang.LOGO_DESCRIPTION}</div>
          </div>
          :
          <div className="current-logo-container">
            <span className="current-image-span">
                <img className="current-logo" src={this.state.currentLogo} alt={lang.CURRENT_LOGO} />
            </span>
            {this.state.editName ?
              <PcsBtn onClick={this.enableLogoUpload} className="upload-logo-button">{lang.CHANGE_LOGO}</PcsBtn>
              : <PcsBtn svg={EditSvg} onClick={this.enableNameEdit} className="edit-name-button">{lang.EDIT}</PcsBtn>
            }
          </div>
        }
        {this.state.editName ?
          <div className="name-container">
            <div className="section-subtitle">{lang.APPLICATION_NAME}</div>
            <EditInput type="text" className="name-input" classForLabel="description"
              isEdit={true} placeholder={this.state.currentApplicationName} onChange={this.onNameChange} />
          </div>
          :
          <div className="name-container">{this.state.currentApplicationName}</div>
        }
        </div>
        }
      </div>
    );
  }

  enableNameEdit = () => {
    this.setState({
      editName: true
    });
  }

  enableLogoUpload = () => {
    this.setState({
      editLogo: true
    });
  }

  onNameChange = (name) => {
    if (name.length === 0) {
      name = undefined;
    }
    this.props.onNameChange(name);
  };

  onUpload = (file) => {
    this.props.onUpload(file);
  };
}

const mapStateToProps = state => {
  return {
    application: state.applicationReducer.application
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlatformSettings);