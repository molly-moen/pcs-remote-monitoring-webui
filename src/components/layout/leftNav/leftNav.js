// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Link } from "react-router";
import lang from '../../../common/lang';
import ApiService from '../../../common/apiService';
import * as actions from '../../../actions';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Spinner from '../../spinner/spinner';

import HamburgerIcon from '../../../assets/icons/Hamburger.svg';
import DashboardIcon from '../../../assets/icons/Dashboard.svg';
import MaintenanceIcon from '../../../assets/icons/MaintenanceIcon.svg';
import DevicesIcon from '../../../assets/icons/Devices.svg';
import RulesIcon from '../../../assets/icons/RulesIcon.svg';
import ContosoIcon from '../../../assets/icons/Contoso.svg';

import './leftNav.css';

const tabConfig = [
  { path: '/dashboard', icon: DashboardIcon, name: lang.DASHBOARD_LABEL },
  { path: '/devices', icon: DevicesIcon, name: lang.DEVICES },
  { path: '/rulesActions', icon: RulesIcon, name: lang.RULES },
  { path: '/maintenance', icon: MaintenanceIcon, name: lang.MAINTENANCE }
];

class LeftNav extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isExpanded: true,
      logo: undefined,
      name: undefined,
      stillInitializing: true
    };

    this.tabLinks = tabConfig.map((item, index) =>
      <Link key={index} to={item.path} className="leftnav-item-container" activeClassName="active">
        <div className="leftnav-item-icon"><img src={item.icon} alt={item.name} /></div>
        <div className="leftnav-item-text">{item.name}</div>
      </Link>
    );

    this.props.actions.getLogo();
  }

  componentWillReceiveProps(nextProps) {
    const { application } = nextProps;
    if (!_.isEqual(application, this.props.application)) {
      this.setState({
        logo: application.logo,
        name: application.name
      });
    }
    if (this.state.stillInitializing) {
      this.setState({
        stillInitializing: false
      });
    }
  }

  toggleExpansion = () => this.setState({ isExpanded: !this.state.isExpanded });

  render() {
    return (
      <div className={`left-nav ${this.state.isExpanded ? 'expanded' : ''}`}>
        {!this.state.stillInitializing ?
          <div className="leftnav-item-container">
            <div className="leftnav-item-icon">
              <img src={this.state.logo} className="page-title-icon" alt="Logo" />
            </div>
            <div className="leftnav-item-text">{this.state.name}</div>
          </div>
          :
          <div className="leftnav-item-container">
            <div className="leftnav-item-icon">
              <Spinner size='small' />
            </div>
          </div>
        }
        <div className="leftnav-item-container hamburger" onClick={this.toggleExpansion}>
          <div className="leftnav-item-icon">
            <img src={HamburgerIcon} alt="HamburgerIcon" />
          </div>
        </div>

        {this.tabLinks}

      </div>
    );
  }

  getLogoAndName() {
    this.props.actions.getLogo();
    ApiService.getLogo().then((response) => {
      this.setState({
        name: response.name ? response.name : lang.CONTOSO,
        logo: response.logo ? response.logo : ContosoIcon,
      });
    });
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);