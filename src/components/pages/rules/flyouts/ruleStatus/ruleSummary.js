import React, { Component } from "react";

import {
  FormLabel,
  Indicator,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';
import { svgs } from 'utilities';
import { joinClasses } from 'utilities';
import './ruleSummary.css';

export class RuleSummary extends Component {

  render() {
    const { rule, isPending, completedSuccessfully, t, className } = this.props;

    return (
      <SummarySection key={rule.id} className={joinClasses('padded-bottom', className)}>
          <SectionHeader>{rule.name}</SectionHeader>
          <FormLabel>{rule.description}</FormLabel>
          <SummaryBody>
            <SummaryCount>{rule.count && rule.count.response ? rule.count.response : '---'}</SummaryCount>
            <SectionDesc>{t('rules.flyouts.ruleEditor.devicesAffected')}</SectionDesc>
            {isPending && <Indicator />}
            {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
          </SummaryBody>
        </SummarySection>
    );
  }
}
