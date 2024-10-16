import request from '@/utils/request';
import { createPagination } from '@/utils';
import { getDvaApp } from 'umi';

const NameSpace = 'easyTableProvider';
let SourceActionMap = {};
let CallbackMap = {};

// Redux 数据池
const model = {
  namespace: NameSpace,
  state: {
    params: {},
    keywords: {},
    page: {},
    loading: {},
    errors: {},
    fixedParams: {},
    pageProps: {},
    dataProp: {},
    form: {},
  },
  effects: {
    *fetch(
      { payload: { name, params, pagination, clearKeywords = false } },
      { put, call, select },
    ) {
      const state = yield select((state) => state[NameSpace]);
      check(name, state);
      if (clearKeywords) {
        yield put({
          type: '_update',
          payload: {
            name,
            keywords: {},
          },
        });
      }
      if (undefined === params) {
        params = state.params[name];
      } else {
        yield put({
          type: '_update',
          payload: {
            name,
            params,
          },
        });
      }
      if (!pagination) {
        pagination = createPagination();
      } else {
        pagination = {
          ...state.page[name],
          ...pagination,
        };
      }
      return yield loadData(
        name,
        pagination,
        params,
        state.fixedParams[name],
        state.keywords?.[name],
        state.pageProps[name],
        state.dataProp[name],
        put,
        call,
      );
    },
    *search(
      { payload: { name, params, resetPage = false, clearKeywords = true } },
      { put, call, select },
    ) {
      const state = yield select((state) => state[NameSpace]);
      check(name, state);
      const update = {
        name,
        params,
      };
      if (clearKeywords) {
        update.keywords = {};
      }
      yield put({
        type: '_update',
        payload: update,
      });
      const page = { ...state.page[name] };
      if (resetPage === true) {
        page.current = 1;
      }
      return yield loadData(
        name,
        page,
        params,
        state.fixedParams[name],
        state.keywords?.[name],
        state.pageProps[name],
        state.dataProp[name],
        put,
        call,
      );
    },
    *paging(
      { payload: { name, pagination, limitDataOptimize } },
      { put, call, select },
    ) {
      const state = yield select((state) => state[NameSpace]);
      check(name, state);
      //限制数据太多只能一页页跳转
      if (limitDataOptimize) {
        if (
          pagination.current > state.page[name].current + 1 &&
          pagination.current >=
            Math.ceil(limitDataOptimize / pagination.pageSize) + 1
        ) {
          pagination.current =
            Math.ceil(limitDataOptimize / pagination.pageSize) + 1;
        }
        console.log(pagination.current, 'pagination.current');
      }
      return yield loadData(
        name,
        {
          ...state.page[name],
          ...pagination,
        },
        state.params[name],
        state.fixedParams[name],
        state.keywords?.[name],
        state.pageProps[name],
        state.dataProp[name],
        put,
        call,
      );
    },
    *refresh({ payload: { name, pagination } }, { put, call, select }) {
      const state = yield select((state) => state[NameSpace]);
      check(name, state);
      if (pagination) {
        pagination = {
          ...state.page[name],
          ...pagination,
        };
      } else {
        pagination = state.page[name];
      }
      return yield loadData(
        name,
        pagination,
        state.params[name],
        state.fixedParams[name],
        state.keywords?.[name],
        state.pageProps[name],
        state.dataProp[name],
        put,
        call,
      );
    },
    *reload({ payload: { name } }, { put, call, select }) {
      const state = yield select((state) => state[NameSpace]);
      check(name, state);
      return yield loadData(
        name,
        { ...state.page[name], current: 1 },
        state.params[name],
        state.fixedParams[name],
        state.keywords?.[name],
        state.pageProps[name],
        state.dataProp[name],
        put,
        call,
      );
    },
  },
  reducers: {
    // 数据池初始化
    _initialize(
      state,
      {
        payload: {
          name,
          form,
          source,
          fixedParams,
          keywords,
          onDataLoaded,
          pageProps,
          dataProp,
          onError,
        },
      },
    ) {
      SourceActionMap[name] = source;
      CallbackMap[name] = { onDataLoaded, onError };
      if (state.page[name]) return state;
      state.page[name] = createPagination();
      state.loading[name] = false;
      state.fixedParams[name] = fixedParams;
      state.keywords[name] = keywords;
      state.form[name] = form;
      if (pageProps) {
        state.pageProps[name] = pageProps;
      }
      if (dataProp) {
        state.dataProp[name] = dataProp;
      }
      return { ...state };
    },
    _update(state, { payload }) {
      const { name } = payload;
      if ('page' in payload) {
        state.page = {
          ...state.page,
          [name]: payload.page,
        };
      }
      if ('params' in payload) {
        state.params[name] = payload.params;
      }
      if ('keywords' in payload) {
        if (!state.keywords) state.keywords = {};
        state.keywords[name] = payload.keywords;
      }
      if ('form' in payload) {
        state.form[name] = payload.form;
      }
      if ('loading' in payload) {
        state.loading[name] = payload.loading;
      }
      if ('error' in payload) {
        state.errors[name] = payload.error;
      }
      if ('fixedParams' in payload) {
        state.fixedParams[name] = payload.fixedParams;
      }
      if ('source' in payload) {
        SourceActionMap[name] = payload.source;
      }
      if ('onDataLoaded' in payload) {
        if (!CallbackMap[name]) CallbackMap[name] = {};
        CallbackMap[name]['onDataLoaded'] = payload.onDataLoaded;
      }
      if ('onError' in payload) {
        if (!CallbackMap[name]) CallbackMap[name] = {};
        CallbackMap[name]['onError'] = payload.onError;
      }
      return { ...state };
    },
    // 清空数据池
    clean(state, { payload: { name } }) {
      if (null == name) {
        state.page = {};
        state.params = {};
        state.keywords = {};
        state.form[name] = {};
        state.loading = {};
        state.errors = {};
        state.fixedParams = {};
        SourceActionMap = {};
        CallbackMap = {};
      } else {
        delete state.page[name];
        delete state.params[name];
        delete state.loading[name];
        delete state.errors[name];
        delete state.fixedParams[name];
        delete state.form[name];
        delete SourceActionMap[name];
        delete CallbackMap[name];
      }
      return { ...state };
    },
    // 修改list内的数据
    update(state, { payload: { name, data } }) {
      if (!Array.isArray(data)) throw new TypeError('Data must be an array');
      state.page[name].data = data;
      return { ...state };
    },
    loading(state, { payload: { name, isLoading } }) {
      state.loading = {
        ...state.loading,
        [name]: isLoading,
      };
      return { ...state };
    },
    error(state, { payload: { name, error } }) {
      state.errors = {
        ...state.errors,
        [name]: error,
      };
      return { ...state };
    },
  },
};
if (!getDvaApp()._models.some(({ namespace }) => namespace === NameSpace)) {
  getDvaApp().model(model);
}

function* loadData(
  name,
  page,
  params,
  fixedParams,
  keywords,
  pageProps = {
    current: 'pageIndex',
    pageSize: 'pageSize',
    total: 'total',
  },
  dataProp = 'data',
  put,
  call,
) {
  yield put({
    type: '_update',
    payload: {
      name,
      loading: true,
      error: undefined,
    },
  });
  const callbacks = CallbackMap[name] || {};
  try {
    let fetch = SourceActionMap[name];
    if (typeof fetch === 'string') {
      fetch = (params) => {
        return request.post(source, params);
      };
    }
    const result = yield call(fetch, {
      [pageProps.current]: page.current,
      [pageProps.pageSize]: page.pageSize,
      ...fixedParams,
      ...params,
      ...keywords,
    });
    if (pageProps.current in result) {
      page.current = result[pageProps.current];
    }
    if (pageProps.pageSize in result) {
      page.pageSize = result[pageProps.pageSize];
    }
    if (result[dataProp].length == 0 && page.current > 1) {
      //数据为空，向上翻页
      page.current -= 1;
      return yield loadData(
        name,
        page,
        params,
        fixedParams,
        keywords,
        pageProps,
        dataProp,
        put,
        call,
      );
    }
    page.total = result[pageProps.total];
    page.data = result[dataProp];
    if (callbacks.onDataLoaded) callbacks.onDataLoaded(page, params);
    yield put({
      type: '_update',
      payload: {
        name,
        page,
      },
    });
  } catch (e) {
    yield put({
      type: 'error',
      payload: {
        name,
        error: e,
      },
    });
    if (callbacks.onError) callbacks.onError(e);
    // throw e;
  } finally {
    yield put({
      type: 'loading',
      payload: {
        name,
        isLoading: false,
      },
    });
  }
  return page;
}

function check(name, state) {
  if (typeof name !== 'string')
    throw new TypeError('Argument [name] must be a string,But got a ' + name);
  if (!state.page[name])
    throw new Error(
      name + ' is not fount,May not be initialized or has been destroyed!',
    );
}
