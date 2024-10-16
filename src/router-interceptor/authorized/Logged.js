import { getCurrentUser } from '@/components/Authorized';
import { parse } from 'query-string';
import { Navigate, Outlet } from 'umi';
export default ({ location }) => {
    let user = getCurrentUser();
    if (!user) {
        const loginPath = '/user/login';
        const ignorePath = [loginPath, '/'];
        const query = ignorePath.indexOf(location.pathname) !== -1 ? {} : { r: window.location.href };
        let { r } = parse(location.search);
        if (r) {
            r = decodeURIComponent(r);
            r = r.substring(r.lastIndexOf('http'));
        }
        return <Navigate to={{ pathname: loginPath, query: { ...query, r } }} />;
    } else if (!user.changedPWD) {
        return <Navigate to={{ pathname: '/user/changePassword', query: location.query }} />;
    }
    return <Outlet />;
};
