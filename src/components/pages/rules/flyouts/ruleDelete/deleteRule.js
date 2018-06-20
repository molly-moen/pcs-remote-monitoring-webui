// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  Svg
} from 'components/shared';
import { svgs } from 'utilities';
import { TelemetryService } from 'services';
import { toNewRuleRequestModel } from 'services/models';
import Flyout from 'components/shared/flyout';
import { RuleSummary } from '..';

import './deleteRule.css';

export class DeleteRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: false,
      error: undefined,
      changesApplied: undefined,
      confirmed: false,
      ruleDeleted: undefined
    };
  }

  componentDidMount() {
    const { rule } = this.props;
    this.setState({ rule, status: !rule.enabled });
  }

  componentWillReceiveProps(nextProps) {
    const { rule } = nextProps;
    this.setState({ rule, status: !rule.enabled });
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onDelete = ({ target: { value } }) => {
    if (this.state.changesApplied) {
      this.setState({ status: value, changesApplied: false });
    } else {
      this.setState({ status: value });
    }
  }

  deleteRule = (event) => {
    event.preventDefault();
    const { rule } = this.state;
    this.setState({ isPending: true, error: null });
    this.subscription =
      TelemetryService.deleteRule(rule.id)
        .subscribe(
          updatedRule => {
            this.props.refresh();
            this.setState({ isPending: false, changesApplied: true, ruleDeleted: true });
          },
          error => this.setState({ error, isPending: false, changesApplied: true })
        );
  }

  changeRuleStatus = (event) => {
    event.preventDefault();
    const { rule, status } = this.state;
    this.setState({ isPending: true, error: null });
    rule.enabled = status;
    this.subscription =
      TelemetryService.updateRule(rule.id, toNewRuleRequestModel(rule))
        .subscribe(
          (updatedRule) => {
            this.props.refresh();
            this.setState({ isPending: false, changesApplied: true, ruleDeleted: false });
          },
          error => this.setState({ error, isPending: false, changesApplied: true })
        );
  }

  confirmDelete = (event) => {
    event.preventDefault();
    this.setState({
      confirmed: true
    });
  }

  render() {
    const { onClose, t, rule } = this.props;
    const { isPending, error, changesApplied, confirmed } = this.state;

    const completedSuccessfully = changesApplied && !error;

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t('rules.flyouts.deleteRule.title')}</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content>
          <form onSubmit={this.deleteRule} className="delete-rule-flyout-container">
            <RuleSummary rule={rule} isPending={isPending} completedSuccessfully={completedSuccessfully} t={t} className="rule-details"/>
            {error && <AjaxError className="rule-delete-error" t={t} error={error} />}
            {!error &&
              (changesApplied
              ? this.renderConfirmation()
              : confirmed
                ? this.renderDeleteDisableButtons()
                : this.renderInitialDeleteButtons())
            }
          </form>
        </Flyout.Content>
      </Flyout.Container>
    );
  }

  renderDeleteDisableButtons() {
    const { t, rule } = this.props;
    const { isPending, status, changesApplied } = this.state;
    return (
      <div>
        <div className="delete-info">
          <Svg className="asterisk-svg" path={svgs.error} />
          <div className="delete-info-text">
            <Trans i18nKey="rules.flyouts.deleteRule.preDeleteText">
              We'll keep...<Link to={`/maintenance/rule/${rule.id}`}>{t(`rules.flyouts.deleteRule.maintenancePage`)}</Link>...to remove
            </Trans>
          </div>
        </div>
        <BtnToolbar>
          <Btn primary={true} disabled={!!changesApplied || isPending} type="submit">{t('rules.flyouts.deleteRule.delete')}</Btn>
          {
            !status &&
            <Btn key="disable" className="rule-status-btn" svg={svgs.disableToggle} onClick={this.changeRuleStatus}>
              <Trans i18nKey="rules.flyouts.disable">Disable</Trans>
            </Btn>
          }
          { this.renderCancelButton() }
        </BtnToolbar>
      </div>
    );
  }

  renderInitialDeleteButtons() {
    const { t } = this.props;
    const { isPending, changesApplied } = this.state;
    return (
      <BtnToolbar>
        <Btn primary={true} disabled={!!changesApplied || isPending} onClick={this.confirmDelete}>{t('rules.flyouts.deleteRule.delete')}</Btn>
        { this.renderCancelButton() }
      </BtnToolbar>
    );
  }

  renderCancelButton() {
    const { onClose, t } = this.props;
    return(
      <Btn svg={svgs.cancelX} onClick={onClose}>{t('rules.flyouts.deleteRule.cancel')}</Btn>
    );
  }

  renderConfirmation() {
    const { onClose, t, rule } = this.props;
    const { ruleDeleted } = this.state;
    const textKey = ruleDeleted ? "rules.flyouts.deleteRule.postDeleteText" : "rules.flyouts.deleteRule.postDisableText"
    return (
      <div>
      <div className="delete-info">
          <Svg className="check-svg" path={svgs.passedCheckmark} />
          <div className="delete-info-text">
            "{rule.name}"
            <Trans i18nKey={textKey}>
              ...<Link to={`/maintenance/rule/${rule.id}`}>{t(`rules.flyouts.deleteRule.maintenancePage`)}</Link>...
            </Trans>
          </div>
        </div>
        <BtnToolbar>
          <Btn primary={true} svg={svgs.cancelX} onClick={onClose}>{t('rules.flyouts.deleteRule.close')}</Btn>
        </BtnToolbar>
        </div>
    );
  }
}
