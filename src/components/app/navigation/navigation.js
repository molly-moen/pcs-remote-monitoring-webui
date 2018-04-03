// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Svg } from 'components/shared';

import { svgs } from 'utilities';

import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
  epics as appEpics,
  getLogo,
  getName
} from 'store/reducers/appReducer';
import './navigation.css';

/** A window size less than this will automatically collapse the left nav */
const minExpandedNavWindowWidth = 800;

/**
 * A presentational component for nav item svgs
 *
 * @param {ReactSVGProps} props see https://www.npmjs.com/package/react-svg
 */
const NavIcon = (props) => (
  <Svg {...props} className="nav-item-icon" />
);

/** A presentational component navigation tab links */
const TabLink = (props) => (
  <NavLink to={props.to} className="nav-item" activeClassName="active">
    <NavIcon path={props.svg} />
    <div className="nav-item-text">{props.t(props.labelId)}</div>
  </NavLink>
);

/** The navigation component for the left navigation */
export class Navigation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      lastWidth: window.innerWidth,
      logoPath: undefined,
      stillInitializing: true
    };

    // Collapse the nav if the window width is too small
    window.addEventListener('resize', this.collapseNav);
  }

  componentWillReceiveProps(nextProps) {
    const { logo, name } = nextProps;
    // if(!logoIsSvg) {
    //   this.setState({
    //     logoPath: URL.createObjectURL(logo)
    //   });
    // } else {
    //   var fileReader = new FileReader();
    //   fileReader.addEventListener("loadend", function() {
    //     var text = fileReader.result;
    //     this.setState({
    //       logoPath: text,
    //       stillInitializing: false
    //     });
    //   });
    //   fileReader.readAsText(logo);
    }
    // if (!_.isEqual(application, this.props.application)) {
    //   this.setState({
    //     logo: application.logo,
    //     name: application.name
    //   });
    // }
    // if (this.state.stillInitializing) {
    //   this.setState({
    //     stillInitializing: false
    //   });
    // }

  collapseNav = () => {
    if (
      window.innerWidth < minExpandedNavWindowWidth
      && window.innerWidth < this.state.lastWidth // When the window is shrinking
      && !this.state.collapsed
    ) {
      this.setState({ collapsed: true, lastWidth: window.innerWidth });
    } else {
      this.setState({ lastWidth: window.innerWidth });
    }
  }

  toggleExpanded = (event) => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const isExpanded = !this.state.collapsed;
    const { name, logo, logoIsDefault } = this.props;
    return (
      <nav className={`app-nav ${isExpanded && 'expanded'}`}>
        <div className="nav-item company">
          {/* <NavIcon path={svgs.contoso} /> */}
          { logoIsDefault ?
            <NavIcon path={logo} />
            :
            <div className = "nav-item-icon">
              <img src={logo} alt="Logo" />
            </div>
          }
          <div className="nav-item-text">{name}</div>
        </div>
        <button className="nav-item hamburger" onClick={this.toggleExpanded} aria-label="Hamburger">
          <NavIcon path={svgs.hamburger} />
        </button>
        { this.props.tabs.map((tabProps, i) => <TabLink {...tabProps} t={this.props.t} key={i} />) }
      </nav>
    );
  }
}


export default Navigation;
