'use strict';
import emojiRegex from 'emoji-regex';
import pathJoin from 'join-path';
import { matchRoutes } from 'react-router-config';
const cloneDeep = require('safe-clone-deep');
const crypto = require('crypto');

// 常用正则验证规则
export const ValidateRegex = {
    Number: /^\d+$/,
    NumberOrLetter: /^[0-9a-zA-Z]*$/g,
    ABARNO: /\d{9}/,
    Tel: /^[0-9#,*()-]*$/g,
    MobilePhoneNo: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    URL: /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-.,@?^=%&:\/~+#]*)+)?/,
    // IP: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,//IP校验
    InputPORT: /^[0-9\\:\\,]*$/,
    SimplePORT: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
    MorePORT: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]):([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
    Cn_En: /^[\u4e00-\u9fa5a-zA-Z0-9\-\\_]+$/, //中英文数字-_
    EnNumber: /^[a-zA-Z0-9]+$/,
    InputIP: /^[0-9\\d\\,\\.\\/\\-]*$/, //允许输入的IP
    SimpleIP: /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/, //普通IP校验
    PrefixIP: /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\/([1-2][0-9]|3[0-2]|[1-9])$/, //前缀IP校验
    LastIP: /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)-(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/, //IP段 -校验
    logCode: /^[0-9\\,]*$/, //事件抑制代码
    Password: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._,~!@#$%^&*<>?])[A-Za-z0-9._,~!@#$%^&*<>?]{8,16}$/, //密码校验
    Mac: /^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/, //mac地址校验
    Cn: /^[^\u4e00-\u9fa5]*$/ //中文
};

export function isUrl(path) {
    return ValidateRegex.URL.test(path);
}

export function unique(arr) {
    arr.sort(); //先排序
    let res = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== res[res.length - 1]) {
            res.push(arr[i]);
        }
    }
    return res;
}

export function getRouteByLink(routes, routeLink) {
    const matches = matchRoutes(routes, routeLink);
    const lastRoute = matches[matches.length - 1];
    if (!lastRoute || !lastRoute.match.isExact) return null;
    return lastRoute;
}

/**
 * 移除对象中的无效键和空串键，常用语表单数据请求接口时处理，空串对接口来说是有效的
 * @param obj
 * @param options
 * @returns {*}
 */
export const removeEmptyProperty = (obj, options = {}) => {
    for (let key in obj) {
        let val = obj[key];
        if (options.ignores && options.ignores.indexOf(key) !== -1) continue;
        if (options.trim !== false && typeof val === 'string') {
            val = val.trim();
        }
        if (null == val || '' === val) delete obj[key];
    }
    return obj;
};

export const md5 = (str, digestType = 'hex') => {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest(digestType);
};
/**
 * 移除对象中的属性
 * @param obj
 * @param props
 */
export const removeProperties = (obj, props) => {
    if (Array.isArray(props)) {
        props.map(key => {
            obj[key] = undefined;
            delete obj[key];
        });
    } else {
        obj[props] = undefined;
        delete obj[props];
    }
};
// 权限数据处理工具
export const PermissionsUtil = {
    structureByDNA(tileData) {
        if (!tileData) return [];
        const tree = { children: [] };
        tileData.map(item => {
            initDNA(item);
            insertWithDNA(item);
        });
        return removeInvalid(tree.children);

        function initDNA(item) {
            const DNA = item.dna || '0';
            const chain = DNA.split('-');
            item.$dna = [];
            chain.forEach(key => {
                item.$dna.push(parseInt(key));
            });
        }

        function insertWithDNA(item) {
            let cursor = tree;
            item.$dna.forEach(key => {
                key = parseInt(key);
                if (!cursor.children) cursor.children = [];
                if (!cursor.children[key]) cursor.children[key] = {};
                cursor = cursor.children[key];
            });
            Object.assign(cursor, item);
        }

        function removeInvalid(permissions) {
            const realList = [];
            loop(realList, permissions);
            return realList;

            function loop(wrapper, list) {
                for (let i = 0; i < list.length; i++) {
                    const item = list[i];
                    if (!item) continue;
                    const children = item.children;
                    delete item.children;
                    if (item.dna) {
                        wrapper.push(item);
                    }
                    if (children) {
                        loop((item.children = []), children);
                    }
                }
            }
        }
    },
    recombineDNA(tree, onItem) {
        this.loopTree(tree, (item, index, arr, parent) => {
            const dna = parent ? parent.dna.split('-') : [];
            dna.push(index);
            item.$dna = dna;
            item.dna = dna.join('-');
            onItem && onItem(item, index, arr, parent);
        });
        return tree;
    },
    toTile(tree) {
        const list = [];
        this.loopTree(this.recombineDNA(tree), item => {
            item = Object.assign({}, item);
            delete item.children;
            delete item.$dna;
            list.push(item);
        });
        return list;
    },
    loopTree(tree, callback) {
        loop(tree);
        function loop(data, parent) {
            data.map((item, index, arr) => {
                callback(item, index, arr, parent);
                if (item.children) {
                    return loop(item.children, item);
                }
            });
        }
    }
};

export const isPromise = function (obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
};

// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
export function urlToList(url) {
    const urllist = url.split('/').filter(i => i);
    return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}

export const joinPath = pathJoin;

// 获取public实际地址，如果部署在二级目录该方法会返回public里面文件的真实URL
export function getPublicPath(path) {
    return joinPath(window.appMeta.baseUrl, path);
}

export function deepClone(obj) {
    return cloneDeep(obj);
}

// 创建一个默认的分页对象
export function createPagination(props = {}) {
    const { showSizeChanger = true, showQuickJumper = true, size = 'small', pageSizeOptions = ['10', '20', '30', '40'], pageSize = 20, current = 1, total = 0, data = [] } = props;
    return {
        showSizeChanger,
        showQuickJumper,
        size,
        pageSizeOptions,
        pageSize,
        current,
        total,
        data
    };
}
// 分页加载
export function* fetchPageEffect({ payload }, { call }, page, action) {
    const params = {
        page_num: page.current,
        page_size: page.pageSize,
        ...payload
    };
    const result = yield call(action, params);
    page.total = result.total;
    page.current = params.page_num;
    page.pageSize = params.page_size;
    page.data = result.data;
    return page;
}

export function toBoolean(val) {
    if (typeof val === 'boolean') return val;
    switch (val) {
        case 'true':
            return true;
        case 'false':
            return false;
        case 0:
        case '0':
            return false;
        case 1:
        case '1':
            return true;
        default:
            return !!val;
    }
}

// 补零
export function zeroize(str, n) {
    if (null == str) return null;
    return (Array(n).join(0) + str).slice(-n);
}

// export function appendQuery(url, query) {
//     if (url.indexOf('?') === -1) {
//         url += '?';
//     }
//     if (!url.endsWith('&')) {
//         url += '&';
//     }
//     url += qs.stringify(query);
//     return url;
// }

//arrayBuffer转16进制
export function bufferToHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

export function getRangeColor(ranges, value, defaultValue) {
    const keys = Object.keys(ranges);
    const key = keys.find((key, index) => {
        const rn = key.split('-');
        if (index === 0) {
            return value <= rn[0];
        } else if (index === keys.length - 1) {
            return value >= rn[0];
        } else {
            const min = rn[0];
            const max = rn[1];
            return value >= min && value <= max;
        }
    });
    return key ? ranges[key] : defaultValue;
}
//emoji替换
export function emojiReplace(input = '') {
    if (input == null || input == undefined) return input;
    const rex = emojiRegex();
    input = input.replace(rex, '');
    return input;
}
//四舍五入
export function getNumfixed(num, digits = 2) {
    let result = parseFloat(num);
    if (isNaN(result)) {
        // alert('传递参数错误，请检查！');
        return '';
    }
    result = Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
    var s_x = result.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + digits) {
        s_x += '0';
    }
    return s_x;
}
//截取文件名
export function getFileName(url) {
    if (!url) return;
    let arr = decodeURIComponent(url).split('fileName');
    arr = arr[arr.length - 1].substring(1).split('/');
    return arr[arr.length - 1];
}
//随机生成字符串
export function getRandomString(len = 15) {
    let _charEn = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let _charNum = '0123456789';
    let _charSys = '._,~!@#$%^&*<>?';

    function RandomIndex(str) {
        let min = 0,
            max = str.length - 1;
        let index = Math.floor(Math.random() * (max - min + 1) + min);
        //返回最终结果
        return str[index];
    }
    let _str = '';
    //循环生成字符串
    for (var i = _str.length; _str.length < len - 1; i++) {
        _str += RandomIndex(_charEn) + RandomIndex(_charNum) + RandomIndex(_charSys);
    }
    return _str;
}
