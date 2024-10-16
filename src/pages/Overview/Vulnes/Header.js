import OverviewHeader from '@/components/OverviewHeader';
import { message } from 'antd';
import { useIntl, useRequest } from 'umi';
import { getStatistic } from './service';

const Header = ({ intervalTime }) => {
    const intl = useIntl();
    const { data = {} } = useRequest(getStatistic, {
        pollingInterval: intervalTime,
        onError: e => {
            message.error(e.message);
        }
    });
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
                        title: intl.formatMessage({ id: 'overview.head8' }),
                        value: data.vlunTotal
                    }
                ],
                [
                    {
                        title: intl.formatMessage({ id: 'overview.head4' }),
                        value: data.todayActiveVehicleTotal
                    },
                    {
                        title: intl.formatMessage({ id: 'overview.head9' }),
                        value: data.handledVulnTotal
                    }
                ]
            ]}
        />
    );
};

export default Header;
