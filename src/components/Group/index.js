import * as Icons from '@ant-design/icons';
import './index.less';
import PropsTypes from 'prop-types';
import React from 'react';

const Group = props => {
    let { icon, title, children, extra, className, style } = props;

    if (typeof icon === 'string') {
        icon = React.createElement(Icons[icon], null, false);
    }
    return (
        <div className={`comp-group ${className || ''}`} style={style}>
            <div className={'comp-group_header'}>
                <div className={'comp-group-header_title'}>
                    {icon && <span className={'comp-group_header_icon'}>{icon}</span>}
                    <span className={'comp-group-header_text'}>{title}</span>
                </div>
                <div className={'comp-group-header_extra'}>{extra}</div>
            </div>
            <div className={'comp-group_content'}>{children}</div>
        </div>
    );
};
Group.propTypes = {
    icon: PropsTypes.oneOfType([PropsTypes.element, PropsTypes.string]),
    title: PropsTypes.any,
    extra: PropsTypes.any
};
export default Group;
