import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const DateFormat = (props) => {
  const { date, format = 'YYYY-MM-DD HH:mm:ss', emptyContent = '-' } = props;
  if (!date) return emptyContent;
  if (isNaN(Number(date))) {
    return moment(date).format(format);
  } else {
    return moment(Number(date)).format(format);
  }
};

DateFormat.propTypes = {
  date: PropTypes.any,
  format: PropTypes.string,
};

export default DateFormat;
