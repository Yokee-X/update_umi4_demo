'use strict';
import { Fragment } from 'react';
import { Button, Drawer } from 'antd';
import { useIntl } from 'umi';
import './index.less';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DRAWER_CONFIRM_WIDTH } from '@/constants/global';
const DrawerConfirm = props => {
    const intl = useIntl();

    const { children, onCancel, onOk, confirmLoading = false, className, cancelText = intl.formatMessage({ id: 'Common.button.cancel' }), okText = intl.formatMessage({ id: 'Common.button.ok' }), okType = 'primary', okButtonProps, cancelButtonProps, footer, extraFooter, ...restProps } = props;
    return (
        <Drawer {...restProps} className={classnames(className, 'comp-DrawerConfirm')} onClose={onCancel}>
            <div className={'comp-DrawerConfirm_content'}>{children}</div>
            {footer !== false && (
                <div className={'comp-DrawerConfirm_footer'}>
                    {footer ? (
                        footer
                    ) : (
                        <Fragment>
                            <div className={'pull-left'}>{extraFooter}</div>
                            <Button {...cancelButtonProps} onClick={onCancel}>
                                {cancelText}
                            </Button>
                            <Button type={okType} loading={confirmLoading} {...okButtonProps} onClick={onOk}>
                                {okText}
                            </Button>
                        </Fragment>
                    )}
                </div>
            )}
        </Drawer>
    );
};
DrawerConfirm.defaultProps = {
    closable: false,
    width: DRAWER_CONFIRM_WIDTH
};
DrawerConfirm.propTypes = {
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    confirmLoading: PropTypes.bool,
    cancelText: PropTypes.any,
    okText: PropTypes.any,
    okType: PropTypes.string,
    okButtonProps: PropTypes.object,
    cancelButtonProps: PropTypes.object,
    footer: PropTypes.any,
    extraFooter: PropTypes.any,
    ...Drawer.propTypes
};

export default DrawerConfirm;
