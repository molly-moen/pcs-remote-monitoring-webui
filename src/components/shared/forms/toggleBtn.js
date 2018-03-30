// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactSVG from 'react-svg';
import { isFunc } from 'utilities';
import { Svg } from 'components/shared';
import { svgs } from 'utilities';

import ToggleOnSvg from '../../../assets/icons/enableToggle.svg';
import ToggleOffSvg from '../../../assets/icons/disableToggle.svg';
import ToggleDisabledSvg from '../../../assets/icons/disable.svg';

import './styles/toggleBtn.css';

export class ToggleBtn extends React.Component  {

  onChange = () => {
    const { onChange, name, value } = this.props;
    if (isFunc(onChange)) {
      const event = {
        target: { name, value: !value }
      };
      onChange(event);
    }
  };

  render() {
    const { value, disabled, className } = this.props;

    const imgProps = {
      path: svgs.disable,
      className: `pcs-toggle ${className || ''}`
    };

    if (!disabled) {
      imgProps.path = value ? svgs.enableToggle : svgs.disableToggle;
      imgProps.onClick = this.onChange;
      imgProps.className += value ? ' enable-toggle' : ' disable-toggle';
    } else {
      imgProps.className += ' disabled';
    }
    return (<Svg {...imgProps} alt="" />);
  }

}

export default ToggleBtn;
