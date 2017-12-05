// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import ChillerSvg from '../../assets/icons/Chiller.svg';
import ElevatorSvg from '../../assets/icons/Elevator.svg';
import EngineSvg from '../../assets/icons/Engine.svg';
import TruckSvg from '../../assets/icons/Truck.svg';
import PrototypingDeviceSvg from '../../assets/icons/PrototypingDevice.svg';
import DeviceIconSvg from '../../assets/icons/DeviceIcon.svg';

import './deviceIcons.css';

class DeviceIcons extends React.Component {
  render() {
    const deviceType = this.props.content.device.Properties.Reported.Type;

    let svg;
    if (deviceType === 'Chiller') {
       svg = ChillerSvg;
    } else if (deviceType === 'Elevator') {
       svg = ElevatorSvg;
    } else if (deviceType === 'Engine') {
       svg = EngineSvg;
		} else if (deviceType === 'Prototyping') {
       svg = PrototypingDeviceSvg;
		} else if (deviceType === 'Truck') {
       svg = TruckSvg;
		} else {
       svg = DeviceIconSvg;
    }

    return <img src={svg} className="device-renderer-icon" alt='Device Icon' />
  }
}

export default DeviceIcons;
