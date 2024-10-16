import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './style.less';
const Index = props => {
    const { total, current, pageSize, onChange } = props;
    const pageCount = Math.ceil(total / pageSize);
    return (
        <div className={styles.content}>
            <LeftOutlined
                style={{
                    color: current == 1 ? 'rgba(0, 0, 0, 0.25)' : '',
                    marginRight: 7
                }}
                onClick={() => {
                    if (current == 1) return;
                    onChange(current - 1, pageSize);
                }}
            />
            <span>
                {current}&nbsp;&nbsp;/&nbsp;&nbsp;{pageCount}
            </span>
            <RightOutlined
                style={{
                    color: current == pageCount ? 'rgba(0, 0, 0, 0.25)' : '',
                    marginLeft: 7
                }}
                onClick={() => {
                    if (current == pageCount) return;
                    onChange(current + 1, pageSize);
                }}
            />
        </div>
    );
};

export default Index;
