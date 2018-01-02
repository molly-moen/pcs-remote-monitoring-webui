// Copyright (c) Microsoft. All rights reserved.

import SeverityCellRenderer from '../cellRenderers/severityCellRenderer/severityCellRenderer';
import StatusCellRenderer from "./statusCellRenderer";
import deviceCountCellRenderer from "./deviceCountCellRenderer";
import LastTriggerCellRenderer from "./lastTriggerCellRenderer";
import DeviceSourceCellRenderer from "./deviceSourceCellRenderer";
import lang from "../../common/lang";

export const LAST_TRIGGER_DEFAULT_WIDTH = 310;

export const DEFAULT_RULES_GRID_PAGE_SIZE = 50;

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

export const rulesAndActionsColumnDefs = {
  ruleName: {
    headerName: lang.RULENAME,
    field: 'Name',
    filter: 'text'
  },
  description: {
    headerName: lang.DESCRIPTION,
    field: 'Description',
    filter: 'text'
  },
  severity: {
    headerName: lang.SEVERITY,
    field: 'Severity',
    filter: 'text',
    cellRendererFramework: SeverityCellRenderer
  },
  filter: {
    headerName: lang.FILTER,
    field: 'GroupId',
    filter: 'text',
    cellRendererFramework: DeviceSourceCellRenderer
  },
  trigger: {
    headerName: lang.TRIGGER,
    field: 'Conditions',
    filter: 'text',
    valueFormatter: ({ value }) => {
      if (Array.isArray(value) && value.length) {
        return value.map(trigger => trigger['Field'] || 'Unknown').join(' and ');
      }
      return 'Unknown'
    }
  },
  notificationType: {
    headerName: lang.NOTIFICATIONTYPE,
    field: 'Action.Type',
    filter: 'text',
    valueFormatter: ({ value }) => value || lang.MAINTENANCE_LOG
  },
  status: {
    headerName: lang.STATUS,
    field: 'Enabled',
    filter: 'text',
    cellRendererFramework: StatusCellRenderer
  },
  count: {
    headerName: lang.COUNT,
    cellRendererFramework: deviceCountCellRenderer,
  },
  lastTrigger: {
    headerName: lang.LASTTRIGGER,
    cellRendererFramework: LastTriggerCellRenderer,
    width: LAST_TRIGGER_DEFAULT_WIDTH
  }
};

export const defaultRulesAndActionsGridProps = {
  domLayout: 'autoHeight',
  rowSelection: 'multiple',
  enableColResize: true,
  suppressCellSelection: true,
  suppressClickEdit: true,
  suppressRowClickSelection: true,
  paginationPageSize: DEFAULT_RULES_GRID_PAGE_SIZE,
};
