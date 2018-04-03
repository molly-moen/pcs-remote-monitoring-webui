// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import moment from 'moment';
import { schema, normalize } from 'normalizr';
import update from 'immutability-helper';
import { createSelector } from 'reselect';
import { TelemetryService, IoTHubManagerService } from 'services';
import { getActiveDeviceGroupId, getDeviceGroupEntities } from './appReducer';
import {
  createReducerScenario,
  createEpicScenario,
  errorPendingInitialState,
  pendingReducer,
  errorReducer,
  setPending,
  getPending,
  getError
 } from 'store/utilities';

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  /** Loads the rules */
  fetchRules: {
    type: 'RULES_FETCH',
    epic: fromAction =>
      TelemetryService.getRules()
        .flatMap(rules =>
          Observable.from(rules)
            .flatMap(({ id, groupId }) => [
              epics.actions.fetchRuleCounts({ id, groupId }),
              epics.actions.fetchRuleLastTriggered(id)
            ])
            .startWith(redux.actions.updateRules(rules, { fromAction }))
        )
        .catch(handleError(fromAction))
  },

  fetchRuleCounts: {
    type: 'RULES_COUNT_FETCH',
    epic: (fromAction, store, action$) =>
      Observable.of(getDeviceGroupEntities(store.getState()))
        .map(entities => entities[fromAction.payload.groupId])
        .flatMap(({ conditions }) => IoTHubManagerService.getDevices(conditions))
        .map(devices => devices.length)
        .map(count => redux.actions.updateRuleCount({ id: fromAction.payload.id, count }))
        .takeUntil(action$.ofType(epics.actionTypes.fetchRules))
        .catch(handleError(fromAction)) // Needs to work with selector
  },

  fetchRuleLastTriggered: {
    type: 'RULES_LAST_TRIGGER_FETCH',
    epic: (fromAction, store, action$) =>
      TelemetryService.getAlarmsForRule(fromAction.payload, {
        order: 'desc',
        limit: 1
      })
      .map(([alarm]) => redux.actions.updateRuleLastTrigger({ id: fromAction.payload, lastTrigger: alarm.dateModified }))
      .takeUntil(action$.ofType(epics.actionTypes.fetchRules))
      .catch(handleError(fromAction)) // Needs to work with selector
  }
});
// ========================= Epics - END

// ========================= Schemas - START
const ruleSchema = new schema.Entity('rules');
const ruleListSchema = new schema.Array(ruleSchema);
// ========================= Schemas - END

// ========================= Reducers - START
const initialState = { ...errorPendingInitialState, entities: {}, items: [] };

const updateRulesReducer = (state, { payload, fromAction }) => {
  const { entities: { rules }, result } = normalize(payload, ruleListSchema);
  return update(state, {
    entities: { $set: rules },
    items: { $set: result },
    lastUpdated: { $set: moment() },
    ...setPending(fromAction.type, false)
  });
};

const updateCountReducer = (state, { payload: { id, count } }) => update(state, {
  entities: { [id]: { count: { $set: count } } }
});

const updateLastTriggerReducer = (state, { payload: { id, lastTrigger } }) => update(state, {
  entities: { [id]: { lastTrigger: { $set: lastTrigger } } }
});

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchRules
];

export const redux = createReducerScenario({
  updateRules: { type: 'RULES_UPDATE', reducer: updateRulesReducer },
  updateRuleCount: { type: 'RULES_COUNT_UPDATE', reducer: updateCountReducer },
  updateRuleLastTrigger: { type: 'RULES_LAST_TRIGGER_UPDATE', reducer: updateLastTriggerReducer },
  registerError: { type: 'RULES_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
});

export const reducer = { rules: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getRulesReducer = state => state.rules;
export const getEntities = state => getRulesReducer(state).entities;
const getItems = state => getRulesReducer(state).items;
export const getRulesLastUpdated = state => getRulesReducer(state).lastUpdated;
export const getRulesError = state =>
  getError(getRulesReducer(state), epics.actionTypes.fetchRules);
export const getRulesPendingStatus = state =>
  getPending(getRulesReducer(state), epics.actionTypes.fetchRules);
export const getRules = createSelector(
  getEntities, getItems, getActiveDeviceGroupId,
  (entities, items, deviceGroupId) =>
    items.reduce((acc, id) => {
      const rule = entities[id];
      return (rule.groupId === deviceGroupId || !deviceGroupId)
        ? [ ...acc, rule ]
        : acc
    }, [])
);
// ========================= Selectors - END
