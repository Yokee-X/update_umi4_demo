import React from 'react';
import PropTypes from 'prop-types';
import { getDvaApp } from 'umi';

export function getCurrentUser() {
    const user = getDvaApp()._store.getState().user;
    return user && user.currentUser;
}

export function checkUserLogged() {
    const user = getCurrentUser();
    return !!user;
}

export function checkUserAuth(route, regularMatching = false) {
    // 没有权限.跳转异常
    const user = getCurrentUser();
    if (!user) return false;
    const authedRoutes = user.routeMap;
    if (!authedRoutes) return false;
    // 有权限
    if (typeof route === 'string') {
        if (!route || route === '/') return true;
        return Object.values(authedRoutes).some(({ pathRegexp, route: itemRoute }) => {
            if (regularMatching) {
                if (!pathRegexp) return false;
                return pathRegexp.test(route);
            } else {
                return itemRoute === route;
            }
        });
    }
    // Function 处理
    if (typeof route === 'function') {
        return route(authedRoutes);
    }
    return false;
}

class Authorized extends React.Component {
    static propTypes = {
        onlyCheckSign: PropTypes.bool,
        route: PropTypes.any.isRequired,
        children: PropTypes.any,
        noMatch: PropTypes.any
    };
    render() {
        const { children, noMatch = null, route, onlyCheckSign, regularMatching } = this.props;
        const childrenRender = typeof children === 'undefined' ? null : children;
        return checkUserAuth(route, regularMatching) ? childrenRender : noMatch;
    }
}

export default Authorized;
