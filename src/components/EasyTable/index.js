import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Input, Pagination, Space, Spin, Table } from 'antd';
import { connect } from 'dva';
import './provider';
import connector from './connector';
import { FormattedMessage } from 'umi';
import diff from 'deep-diff';
import SimplePagination from '../SimplePagination';
import './style.less';
import { emojiReplace } from '@/utils';
import { injectIntl } from 'umi';
import TrimBlurInput from '../TrimBlurInput';
import classNames from 'classnames';
import styles from './style.less';
@connect(({ easyTableProvider }) => ({
    easyTableProvider
}))
class EasyTable extends React.Component {
    static propTypes = {
        source: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired, // 数据源
        name: PropTypes.string.isRequired, // Table的名称，provider数据池识别的键,必须唯一。
        autoFetch: PropTypes.bool, // 是否在初始化后自动加载数据
        keepData: PropTypes.bool, // 持久保存Redux数据
        fixedParams: PropTypes.object, // 请求固定携带的附加参数
        renderHeader: PropTypes.func, // 顶部渲染回调
        onDataLoaded: PropTypes.func, // 数据加载成功后回调
        onError: PropTypes.func, // 发生错误时回调
        onChange: PropTypes.func, // Table发生变化时回调
        before: PropTypes.any, // 表格前面的内容
        after: PropTypes.any, // 表格后面的内容
        wrappedComponentRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        columns: PropTypes.array,
        pageProps: PropTypes.object, // Page的参数属性
        dataProp: PropTypes.string, // data取值的属性
        search: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        hidePagination: PropTypes.bool, //隐藏分页器展示
        limitDataOptimize: PropTypes.number, //限制数据太多更改分页器展示
        limitTotal: PropTypes.number //限制翻页器总数
    };
    static defaultProps = {
        autoFetch: false,
        keepData: false,
        onDataLoaded() {},
        onError() {},
        hidePagination: false
    };
    static connect = connector;

    constructor(props) {
        const payload = {
            name: props.name,
            source: props.source,
            onDataLoaded: props.onDataLoaded,
            onError: props.onError,
            fixedParams: props.fixedParams,
            pageProps: props.pageProps,
            dataProp: props.dataProp
        };
        if (props.search) {
            payload.keywords = { [props.search.name || 'keywords']: '' };
        }
        props.dispatch({
            type: 'easyTableProvider/_initialize',
            payload
        });
        if (typeof props.name !== 'string') {
            throw new ReferenceError('Argument [name] require string,But got a ' + name);
        }
        super(props);
    }
    state = {
        columns: []
    };

    componentDidMount() {
        const {
            easyTableProvider: { page: dataPage },
            name,
            keepData,
            autoFetch,
            wrappedComponentRef,
            columns
        } = this.props;
        if (autoFetch && !(keepData && dataPage[name] && dataPage[name].total > 0)) {
            this.fetch();
        }
        this.setState({
            columns: columns.map(v => ({ ...v, align: 'center' }))
        });
        if (wrappedComponentRef) {
            if (typeof wrappedComponentRef === 'function') {
                wrappedComponentRef(this);
            } else {
                wrappedComponentRef.current = this;
            }
        }
    }

    componentWillUnmount() {
        if (!this.props.keepData) {
            this.clean();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.name !== nextProps.name) {
            throw new Error('The name of the EasyTable cannot be changed，You can switch between multiple tables');
        }
        if (nextProps.columns !== this.props.columns) {
            this.setState({
                columns: nextProps.columns.map(v => ({ ...v, align: 'center' }))
            });
        }
        // const changedProps = [];
        // ['source', 'onDataLoaded', 'onError'].map(key => {
        //     if (this.props[key] !== nextProps[key]) {
        //         changedProps.push(key);
        //     }
        // });
        // ['fixedParams'].map(key => {
        //     if (diff(this.props[key], nextProps[key])) {
        //         changedProps.push(key);
        //     }
        // });
        // if (changedProps.length > 0) {
        //     let changeValue = {};
        //     changedProps.map(key => {
        //         if (key in nextProps) {
        //             changeValue[key] = nextProps[key];
        //         }
        //     });
        //     this.props.dispatch({
        //         type: 'easyTableProvider/_update',
        //         payload: {
        //             name: this.props.name,
        //             ...changeValue
        //         }
        //     });
        // }
    }

    fetch = (params, pagination, clearKeywords) => {
        return this._dispatch('easyTableProvider/fetch', {
            params,
            pagination,
            clearKeywords
        });
    };
    refresh = pagination => {
        return this._dispatch('easyTableProvider/refresh', { pagination });
    };
    reload = () => {
        return this._dispatch('easyTableProvider/reload');
    };
    paging = (pagination, limitDataOptimize) => {
        return this._dispatch('easyTableProvider/paging', {
            pagination,
            limitDataOptimize
        });
    };
    search = (params, clearKeywords = true) => {
        return this._dispatch('easyTableProvider/search', {
            params,
            resetPage: true,
            clearKeywords
        });
    };
    bindForm = form => {
        return this._dispatch('easyTableProvider/_update', { form });
    };
    getProviderState = () => {
        const { easyTableProvider, name } = this.props;
        return {
            errors: easyTableProvider.errors[name],
            fixedParams: easyTableProvider.fixedParams[name],
            params: easyTableProvider.params[name],
            loading: easyTableProvider.loading[name],
            page: easyTableProvider.page[name],
            pageProps: easyTableProvider.pageProps[name],
            dataProp: easyTableProvider.dataProp[name],
            keywords: easyTableProvider.keywords?.[name]
        };
    };

    clean() {
        this._dispatch('easyTableProvider/clean', {});
    }

    _dispatch(action, params) {
        return this.props.dispatch({
            type: action,
            payload: {
                name: this.props.name,
                ...params
            }
        });
    }

    handleChange = pagination => {
        this.paging(pagination, this.props.limitDataOptimize).then(res => {
            this.props.onChange && this.props.onChange(res);
        });
    };

    render() {
        let {
            easyTableProvider: { page: dataPage, loading, errors, keywords, form },
            name,
            search,
            hidePagination,
            limitDataOptimize,
            intl,
            limitTotal,
            dataSource,
            title,
            extra,
            className,
            style,
            renderHeader,
            before,
            after,
            ...restProps
        } = this.props;
        let page = dataPage[name] || {},
            busy = loading[name] || false,
            error = errors[name],
            searchForm = form[name];
        const kds = keywords?.[name] || {};
        const { columns } = this.state;
        if (!renderHeader) {
            renderHeader = (title, search, extra) => {
                if (!title && !search && !extra) return null;
                const searchConfig = typeof search === 'object' ? search : { name: 'keywords' };
                return (
                    <div className={'comp-easytable_header'}>
                        <div className={'comp-easytable_header_title'}>
                            {title}
                            {search && (
                                <TrimBlurInput.Search
                                    allowClear
                                    onSearch={value => {
                                        if (!value) {
                                            this._dispatch('easyTableProvider/_update', {
                                                keywords: { [searchConfig.name]: '' }
                                            });
                                        } else {
                                            this._dispatch('easyTableProvider/_update', {
                                                keywords: { [searchConfig.name]: value }
                                            });
                                        }
                                        if (searchForm) {
                                            searchForm.submit();
                                        } else {
                                            this.fetch(undefined, undefined, false);
                                        }
                                    }}
                                    {...searchConfig}
                                    value={kds[searchConfig.name]}
                                    onChange={value => {
                                        return this._dispatch('easyTableProvider/_update', {
                                            keywords: { [searchConfig.name]: value }
                                        });
                                    }}
                                    onBlur={value => {
                                        return this._dispatch('easyTableProvider/_update', {
                                            keywords: { [searchConfig.name]: value }
                                        });
                                    }}
                                />
                            )}
                            {extra}
                        </div>
                    </div>
                );
            };
        }
        if (title === false) title = null;
        if (typeof title === 'function') title = title(page);
        const containerCls = classNames(className, styles.tableContainer);
        return (
            <div className={containerCls} style={style}>
                <Spin spinning={busy}>
                    {renderHeader(title, search, extra, page)}
                    {error ? (
                        <div className={'comp-easytable_error-container'}>
                            <Alert
                                message={error.message}
                                type="error"
                                description={
                                    <div className={'text-center gutter-top'}>
                                        <Button onClick={this.refresh}>
                                            <FormattedMessage id={'Common.button.retry'} />
                                        </Button>
                                    </div>
                                }
                            />
                        </div>
                    ) : (
                        <Fragment>
                            {before != null && <div className={'comp-easytable_before'}>{before}</div>}
                            <Table className={'comp-easytable_table'} size="small" {...restProps} pagination={false} dataSource={dataSource || page.data} columns={columns} onChange={this.handleChange} />
                            {!hidePagination && (
                                <div className={'comp-easytable_footer'}>
                                    <div className={'comp-easytable_footer__total'}>
                                        {intl.formatMessage({ id: 'Common.table.paginationBefore' }, { total: page.total })}
                                        <span className={'text-primary'}>{page.pageSize}</span>
                                        {intl.formatMessage({ id: 'Common.table.paginationAfter' })}
                                    </div>
                                    <div className={'comp-easytable_footer__pagination'}>
                                        {limitDataOptimize && page.current * page.pageSize > limitDataOptimize ? (
                                            <SimplePagination {...page} onChange={(current, pageSize) => this.handleChange({ current, pageSize })} />
                                        ) : (
                                            <Pagination
                                                {...page}
                                                total={limitTotal && page.total > limitTotal ? limitTotal : page.total}
                                                onChange={(current, pageSize) => this.handleChange({ current, pageSize })}
                                                onShowSizeChange={(current, pageSize) =>
                                                    this.handleChange({
                                                        current,
                                                        pageSize
                                                    })
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                            {after != null && <div className={'comp-easytable_after'}>{after}</div>}
                        </Fragment>
                    )}
                </Spin>
            </div>
        );
    }
}

export default injectIntl(EasyTable);
