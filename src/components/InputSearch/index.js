import TrimBlurInput from '@/components/TrimBlurInput';
import { DropboxOutlined } from '@ant-design/icons';
import { Result, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useRequest } from 'umi';
import styles from './index.less';
export default ({
    action,
    labelKey = 'label',
    valueKey = 'value',
    searchKey = '',
    params = {},
    onChange,
    onSearch,
    itemRender = false, //自定义渲染子节点
    ...others
}) => {
    const [visible, setVisible] = useState(false);
    const intl = useIntl();
    const [data, setData] = useState(undefined);
    const { run, loading, error } = useRequest(action, {
        manual: true,
        throwOnError: true,
        debounceInterval: 500,
        formatResult: res => res.data,
        onSuccess: res => {
            setData(res);
        }
        // onError: (err) => {
        //     message.error(err.message);
        // }
    });
    useEffect(() => {
        document.addEventListener('click', e => {
            if (typeof e.target.className == 'string') {
                if (!e.target.className?.includes(styles.container)) {
                    setVisible(false);
                    setData(undefined);
                }
            }
        });
        return () => {
            document.removeEventListener('click', e => {});
        };
    }, []);
    const handleChange = v => {
        setVisible(false);
        setData(undefined);
        if (onChange) {
            onChange(v, null);
        }
    };
    const handleSearch = value => {
        console.log(value, 'handleSearch');
        let obj = { ...params };
        if (searchKey) {
            obj[searchKey] = value;
        }
        run(obj);
        setVisible(true);
        if (onSearch) {
            onSearch(value);
        }
    };
    const handleClick = item => {
        onChange(item[valueKey], item);
        setVisible(false);
    };
    return (
        <div className={styles.main}>
            <TrimBlurInput.Search autoComplete="off" {...others} onChange={handleChange} onSearch={handleSearch} />
            <div className={styles.content + ' InputPopup'} style={{ display: visible ? 'block' : 'none' }}>
                <Spin spinning={loading}>
                    <div className={styles.container}>
                        {/* {error && <Alert message={error.message} type="error" />} */}
                        {data?.length == 0 && <Result icon={<DropboxOutlined style={{ color: '#c0c0c0' }} />} title={<span style={{ color: '#c0c0c0' }}>{intl.formatMessage({ id: 'Common.msg.nodata' })}</span>} />}
                        {data?.length > 0 &&
                            data.map((item, index) => (
                                <div className={styles.item} key={index} onClick={() => handleClick(item)}>
                                    {itemRender ? itemRender(item) : item[labelKey]}
                                </div>
                            ))}
                    </div>
                </Spin>
            </div>
        </div>
    );
};
