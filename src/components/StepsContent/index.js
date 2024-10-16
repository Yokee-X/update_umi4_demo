import React, { Component, useEffect, useState } from 'react';
import PropsTypes from 'prop-types';

const StepsContent = props => {
    const { activeIndex, onRef, onWrappedComponentRef, contentProps } = props;
    const [list, setList] = useState([]);

    useEffect(() => {
        shadowTabs(props.list);
    }, [props.list]);
    function shadowTabs(list) {
        let thisList = [];
        list.map((item, index) => {
            thisList.push({
                key: index,
                content: item
            });
        });
        setList(thisList);
    }

    const child = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const renderContent = () => {
            const Component = item.content;
            const props = { key: activeIndex };
            if (onRef)
                props.ref = ref => {
                    onRef(activeIndex, ref);
                };
            if (onWrappedComponentRef) {
                props.wrappedComponentRef = ref => {
                    onWrappedComponentRef(activeIndex, ref);
                };
            }
            item.$content = <Component {...props} {...contentProps} $key={item.key} />;
        };
        if (i <= activeIndex) {
            if (!item.$content && item.key === activeIndex) {
                renderContent();
            }
        } else {
            item.$content = null;
        }
        if (item.$content) {
            child.push(
                React.createElement(
                    'div',
                    {
                        style: { display: item.key === activeIndex ? '' : 'none' },
                        key: item.key
                    },
                    item.$content
                )
            );
        }
    }
    return child;
};

StepsContent.propTypes = {
    list: PropsTypes.array,
    activeIndex: PropsTypes.any,
    onRef: PropsTypes.func,
    onWrappedComponentRef: PropsTypes.func,
    contentProps: PropsTypes.object
};
export default StepsContent;
