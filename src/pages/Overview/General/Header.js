import OverviewHeader from '@/components/OverviewHeader';
import { getStatistic } from '@/pages/Overview/General/service';
import { message } from 'antd';
import { useEffect } from 'react';
import { useIntl, useRequest } from 'umi';

const Header = ({ filter, intervalTime }) => {
    const { run, data = {} } = useRequest(getStatistic, {
        manual: true,
        pollingInterval: intervalTime,
        onError: e => {
            message.error(e.message);
        }
    });
    const intl = useIntl();
    useEffect(() => {
        run(filter);
    }, [filter]);
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
                        title: intl.formatMessage({ id: 'overview.head3' }),
                        value: data.todayAttackTotal
                    },
                    {
                        title: intl.formatMessage({ id: 'overview.head4' }),
                        value: data.todayActiveVehicleTotal
                    },
                    {
                        title: intl.formatMessage({ id: 'overview.head5' }),
                        value: data.todayAddVehicleTotal
                    }
                ]
            ]}
        />
    );
};

export default Header;
