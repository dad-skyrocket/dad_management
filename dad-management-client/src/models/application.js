/**
 * application
 *
 * @author hyczzhu
 */
/**
 * slot
 *
 * @author hyczzhu
 */
import modelExtend from 'dva-model-extend'
import { queryList, query, create, update, changeStatus } from 'services/application'
import { pageModel } from 'models/common'
import queryString from 'query-string'

const transformData = item => ({
    ...item,
    country_obj: {
        country: item.country,
        all: !(item.country || []).length,
    },
})

export default modelExtend(pageModel, {

    namespace: 'application',

    state: {
        currentItem: {},
        modalVisible: false,
        modalType: 'create',
        selectedRowKeys: [],
        filter: {},
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/application') {
                    dispatch({ type: 'query',
                        payload: {
                            status: 2,
                            ...queryString.parse(location.search),
                        } })
                }
            })
        },
    },

    effects: {
        * query ({ payload }, { call, put }) {
            const data = yield call(queryList, payload)
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.data,
                        pagination: {
                            current: Number(payload.page) || 1,
                            pageSize: Number(payload.pageSize) || 10,
                            total: data.total,
                        },
                    },
                })
            } else {
                throw data
            }
        },

        * create ({ payload }, { call, put }) {
            const data = yield call(create, payload)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

        * update ({ payload }, { call, put, select }) {
            const { pagination } = yield select(_ => _.campaign)

            const data = yield call(update, payload)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
            } else {
                throw data
            }
        },

        * prepareEdit ({ payload: camp_id }, { call, put }) {
            const data = yield call(query, { camp_id })
            if (data) {
                yield put({
                    type: 'showModal',
                    payload: {
                        modalType: 'update',
                        currentItem: transformData(data),
                    },
                })
            }
        },

        * changeStatus ({ payload }, { call, put, select }) {
            const { pagination } = yield select(_ => _.campaign)

            const data = yield call(changeStatus, payload)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
            } else {
                throw data
            }
        },
    },

    reducers: {
        setFilter (state, { payload }) {
            return { ...state, filter: payload }
        },

        showModal (state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },

    },
})
