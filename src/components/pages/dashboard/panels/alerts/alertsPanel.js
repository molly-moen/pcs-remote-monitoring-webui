// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { AjaxError, Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay,
  PanelError
} from 'components/pages/dashboard/panel';
import { RulesGrid, rulesColumnDefs } from 'components/pages/rules/rulesGrid';
import { translateColumnDefs } from 'utilities';

export class AlertsPanel extends Component {

  constructor(props) {
    super(props);

    this.columnDefs = [
      {
        ...rulesColumnDefs.ruleName,
        minWidth: 200
      },
      rulesColumnDefs.severity,
      {
        headerName: 'rules.grid.count',
        field: 'count'
      },
      rulesColumnDefs.explore
    ];
  }

  render() {
    const { t, alerts, isPending, error } = this.props;
    const gridProps = {
      columnDefs: translateColumnDefs(t, this.columnDefs),
      rowData: alerts,
      suppressFlyouts: true,
      t
    };
    const showOverlay = isPending && !alerts.length;
    return (
      <Panel className="alerts-panel-container">
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.alerts.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent>
          <RulesGrid {...gridProps} />
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
        { error && <PanelError><AjaxError t={t} error={error} /></PanelError> }
      </Panel>
    );
  }
}
