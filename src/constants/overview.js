import intl from '../locales';

export const RiskLevel = {
    0: intl.formatMessage({ id: 'overview.ungraded' }),
    1: 'QM',
    2: intl.formatMessage({ id: 'overview.low' }),
    3: intl.formatMessage({ id: 'overview.middle' }),
    4: intl.formatMessage({ id: 'overview.high' }),
    5: intl.formatMessage({ id: 'overview.severe' })
};

export const EventGrades = {
    1: intl.formatMessage({ id: 'overview.high' }),
    2: intl.formatMessage({ id: 'overview.middle' }),
    3: intl.formatMessage({ id: 'overview.low' })
};

export const EventGradesColor = {
    1: '#EA3223',
    2: '#F19D4C',
    3: '#75FBFD'
};
