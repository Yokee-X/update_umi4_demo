import { setLocale, getLocale } from 'umi';
import classNames from 'classnames';
import { GlobalOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';

import styles from './index.less';

const SelectLang = props => {
    const changeLang = ({ key }) => {
        setLocale(key);
    };

    const selectedLang = getLocale();
    const locales = ['zh-CN', 'en-US'];
    const languageLabels = {
        'zh-CN': '简体中文',
        'en-US': 'English'
    };
    const languageIcons = {
        'zh-CN': '🇨🇳',
        'en-US': 'us'
    };
    const langMenu = (
        <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
            {locales.map(locale => (
                <Menu.Item key={locale}>
                    <span role="img" aria-label={languageLabels[locale]}>
                        {languageIcons[locale]}
                    </span>{' '}
                    {languageLabels[locale]}
                </Menu.Item>
            ))}
        </Menu>
    );
    return (
        <Dropdown overlay={langMenu}>
            <span className={classNames(styles.dropDown)}>
                {languageIcons[selectedLang]}
                <GlobalOutlined />
            </span>
        </Dropdown>
    );
};
export default SelectLang;
