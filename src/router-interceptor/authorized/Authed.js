import E403 from '@/pages/Exception/403';
// import E404 from '@/pages/Exception/404';
import { checkUserAuth } from '@/components/Authorized';
import { Outlet } from 'umi';

export default props => {
    const { match, routes, location } = props;
    console.log('props', props);
    if (!location.pathname || location.pathname === '/') return <Outlet />;
    if (!checkUserAuth(location.pathname, true)) {
        return <E403 />;
    }
    // if (!getRouteByLink(routes, location.pathname)) {
    //   return <Outlet  />;
    // }

    return <Outlet />;
};
