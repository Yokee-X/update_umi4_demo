import app from './en-US/app';
import route from './en-US/route';
import validator from './en-US/validator';
import common from './en-US/common';
import component from './en-US/component';
import modePermissions from './en-US/models/permissions';
import pageChangePassword from './en-US/pages/changePassword';
import pageException from './en-US/pages/exception';
import pageLogin from './en-US/pages/login';
import pageSystem from './en-US/pages/system';
import property from './en-US/pages/property';
import safeAudit from './en-US/pages/safeAudit';
import safeMonitor from './en-US/pages/safeMonitor';
import relevanceAnalysis from './en-US/pages/relevanceAnalysis';
import vulnerabilitys from './en-US/pages/vulnerabilitys';
import strategy from './en-US/pages/strategy';
import overview from './en-US/pages/overview';
import user from './en-US/pages/user';
import upgrade from './en-US/pages/upgrade';
import statistics from './en-US/pages/statistics';

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
    ...relevanceAnalysis,
    ...vulnerabilitys,
    ...strategy,
    ...overview,
    ...user,
    ...upgrade,
    ...statistics
};
