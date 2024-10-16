import { Col, Space, Popover, Row } from 'antd';
import styles from './style.less';
import PropTypes from 'prop-types';
import { MoreOutlined } from '@ant-design/icons';
import { Children } from 'react';
/**
 * 处理子元素扁平化
 * @param {*} children
 * @returns
 */
export const toArray = children => {
    let nodes = [];
    //处理节点
    Children.forEach(children, v => {
        if (!v) return null;
        if (Array.isArray(v)) {
            nodes = nodes.concat(toArray(v));
        } else if (v.type === Symbol.for('react.fragment') && v.props) {
            // 检查是否空标签
            nodes = nodes.concat(toArray(v.props.children));
        } else {
            nodes.push(v);
        }
    });
    nodes = nodes.filter(v => !!v);
    if (!nodes.length) return null;
    return nodes;
};
/**
 *
 * @param {*} show 展示个数
 * @returns
 *
 */
const MoreTools = ({ children, show = 1, size = 8 }) => {
    //渲染children
    const render = () => {
        const childList = toArray(children);
        if (!childList) return null;
        if (childList.length >= show + 1) {
            if (show > 1) {
                return (
                    <Space size={size}>
                        {childList.slice(0, show - 1)}
                        <Popover
                            title={'更多'}
                            overlayClassName={styles.MoreTools}
                            // placement="bottom"
                            content={
                                <Row type="flex" justify="center" gutter={8}>
                                    {childList.slice(show - 1).map((v, i) => (
                                        <Col key={i}>{v}</Col>
                                    ))}
                                </Row>
                            }
                        >
                            <MoreOutlined />
                        </Popover>
                    </Space>
                );
            }
            return (
                <Popover
                    title={'更多'}
                    overlayClassName={styles.MoreTools}
                    // placement="bottom"
                    content={
                        <Row type="flex" gutter={gap}>
                            {childList.map((v, i) => (
                                <Col key={i}>{v}</Col>
                            ))}
                        </Row>
                    }
                >
                    <MoreOutlined />
                </Popover>
            );
        } else {
            return <Space size={size}>{childList}</Space>;
        }
    };
    return render(children);
};
MoreTools.propTypes = {
    children: PropTypes.any,
    exceed: PropTypes.number,
    show: PropTypes.number
};
export default MoreTools;
