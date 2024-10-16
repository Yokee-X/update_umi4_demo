import OverviewHeader from '@/components/OverviewHeader';
import { message } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';
import { getStatistic } from './service';

const Header = ({ filter, intervalTime }) => {
    const { run, data = {} } = useRequest(getStatistic, {
        manual: true,
        pollingInterval: intervalTime,
        onError: e => {
            message.error(e.message);
        }
    });
    useEffect(() => {
        if (filter.vehicleModleId) {
            run(filter);
        }
    }, [filter]);
    const intl = useIntl();
    return (
        <OverviewHeader
            title={intl.formatMessage({ id: 'overview.title' })}
            statistic={[
                [
                    {
                        title: intl.formatMessage({ id: 'overview.head1' }),
                        value: data.vehicleTotal
                    },
                    {
                        title: intl.formatMessage({ id: 'overview.head2' }),
                        value: data.attackTotal
                    }
                ],
                [
                    {
                        title: intl.formatMessage({ id: 'overview.head4' }),
                        value: data.todayActiveVehicleTotal
                    },
                    {
                        title: intl.formatMessage({ id: 'overview.head3' }),
                        value: data.todayAttackTotal
                    }
                ]
            ]}
        />
    );
};

export default Header;
