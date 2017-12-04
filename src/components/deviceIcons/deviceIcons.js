// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import ChillerSvg from '../../assets/icons/Chiller.svg';
import ElevatorSvg from '../../assets/icons/Elevator.svg';
import EngineSvg from '../../assets/icons/Engine.svg';
import TruckSvg from '../../assets/icons/Truck.svg';
import PrototypingDeviceSvg from '../../assets/icons/PrototypingDevice.svg';
import DeviceIconSvg from '../../assets/icons/DeviceIcon.svg';

class DeviceIcons extends React.Component {
  render() {
    const value = this.props.content.device.Properties.Reported.Type;
		console.log(this.props.content.device.Properties.Reported.Type, 'props needed');

    let svg;
    if (value === 'Chiller') {
        svg = ChillerSvg;
    } else if (value === 'Elevator') {
        svg = ElevatorSvg;
    } else if (value === 'Engine') {
        svg = EngineSvg;
		} else if (value === 'Prototyping') {
        svg = PrototypingDeviceSvg;
		} else if (value === 'Truck') {
        svg = TruckSvg;
		} else {
        svg = DeviceIconSvg;
    }

    return <img src={svg} className="device-renderer-icon" alt='Device Icon' />
  }
}

export default DeviceIcons;
