import { FormattedMessage, Link } from 'umi';
import PageHeader from '@/components/PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';

const PageHeaderWrapper = ({ children, contentWidth, wrapperClassName, top, title, ...restProps }) => (
    <div style={{ margin: '20px 20px 0' }} className={wrapperClassName}>
        {top}
        <MenuContext.Consumer>
            {value => (
                <PageHeader
                    wide={contentWidth === 'Fixed'}
                    home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
                    {...value}
                    key="pageheader"
                    {...restProps}
                    title={title || document.pageTitle}
                    linkElement={Link}
                    itemRender={item => {
                        if (item.locale) {
                            return <FormattedMessage id={item.locale} defaultMessage={item.name} />;
                        }
                        return item.name;
                    }}
                />
            )}
        </MenuContext.Consumer>
        {children ? <GridContent>{children}</GridContent> : null}
    </div>
);

export default connect(({ setting }) => ({
    contentWidth: setting.contentWidth
}))(PageHeaderWrapper);
