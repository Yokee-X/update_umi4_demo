import classNames from 'classnames';
import styles from './index.less';
import { CopyrightOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'umi';

export default props => {
    const { className, links } = props;
    const clsString = classNames(styles.globalFooter, className);
    const { buildVersion = 0 } = appMeta;
    return (
        <div className={clsString}>
            {links && (
                <div className={styles.links}>
                    {links.map(link => (
                        <a key={link.key} target={link.blankTarget ? '_blank' : '_self'} href={link.href}>
                            {link.title}
                        </a>
                    ))}
                </div>
            )}
            <div className={styles.copyright}>
                <span>
                    Copyright <CopyrightOutlined /> <FormattedMessage id={'App.copyright'} />
                </span>
                <span>
                    <FormattedMessage id={'App.version'} /> : {buildVersion}
                </span>
            </div>
        </div>
    );
};
