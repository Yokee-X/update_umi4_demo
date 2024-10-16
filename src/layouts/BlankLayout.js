import { getPageTitle } from './BasicLayout';
import { Helmet } from 'umi';

const BlankLayout = props => {
    const { children } = props;
    return (
        <>
            <Helmet>
                <title>{getPageTitle(props)}</title>
            </Helmet>
            <div>{children}</div>
        </>
    );
};
export default BlankLayout;
