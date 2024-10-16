import app from './zh-CN/app';
import route from './zh-CN/route';
import validator from './zh-CN/validator';
import common from './zh-CN/common';
import component from './zh-CN/component';
import modePermissions from './zh-CN/models/permissions';
import pageChangePassword from './zh-CN/pages/changePassword';
import pageException from './zh-CN/pages/exception';
import pageLogin from './zh-CN/pages/login';
import pageSystem from './zh-CN/pages/system';
import property from './zh-CN/pages/property';
import safeAudit from './zh-CN/pages/safeAudit';
import safeMonitor from './zh-CN/pages/safeMonitor';
import relevanceAnalysis from './zh-CN/pages/relevanceAnalysis';
import vulnerabilitys from './zh-CN/pages/vulnerabilitys';
import strategy from './zh-CN/pages/strategy';
import overview from './zh-CN/pages/overview';
import user from './zh-CN/pages/user';
import upgrade from './zh-CN/pages/upgrade';
import statistics from './zh-CN/pages/statistics';

export default {
    ...app,
    ...route,
    ...validator,
    ...common,
    ...component,
    ...modePermissions,
    ...pageChangePassword,
    ...pageException,
    ...pageLogin,
    ...pageSystem,
    ...property,
    ...safeAudit,
    ...safeMonitor,
    ...vulnerabilitys,
    ...relevanceAnalysis,
    ...strategy,
    ...overview,
    ...user,
    ...upgrade,
    ...statistics
};
