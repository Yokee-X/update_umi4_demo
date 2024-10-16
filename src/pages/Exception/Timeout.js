import Exception from '@/components/Exception';
import { Button } from 'antd';
import { history, useIntl } from 'umi';

export default ({ customAction = null, cb, goBack = true }) => {
    const intl = useIntl();
    return (
        <Exception
            title={intl.formatMessage({ id: 'Component.Exception.timeout' })}
            style={{ minHeight: 300, height: '80%' }}
            actions={
                customAction || (
                    <Button
                        onClick={() => {
                            cb?.();
                            goBack && history.goBack();
                        }}
                    >
                        {intl.formatMessage({ id: 'Component.Exception.return' })}
                    </Button>
                )
            }
        />
    );
};
