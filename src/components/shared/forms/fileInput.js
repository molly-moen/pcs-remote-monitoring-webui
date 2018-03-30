// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

import { Btn } from 'components/shared';
import { joinClasses, svgs } from 'utilities';

import './styles/select.css';
import './styles/fileInput.css';

export const FileInput = ({ label, acceptTypes, className, ...props }) => {
  let fileInput = null;

  function fileInputClick() {
    fileInput.click();
  }


  const { t } = props;
  return (
    <span className={joinClasses(className, "file-upload")}>
      <Btn className="upload-btn" svg={svgs.upload} onClick={fileInputClick}>
        {t('fileInput.upload')}
      </Btn>
      <input className="input-file" ref={(input) => { fileInput = input; }} type="file" accept={acceptTypes} {...props} />
    </span>
  );

}

FileInput.propTypes = { className: PropTypes.string };
