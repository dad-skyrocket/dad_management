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
// import queryString from 'query-string'
import PLATFORM from '../constants/PLATFORM'

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
        platform: PLATFORM.PC_WEB,
        selectedRowKeys: [],
        filter: {},
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/application') {
                    const payload = location.query || { page: 1, pageSize: 10 }
                    dispatch({
                        type: 'query',
                        payload: {
                            ...payload,
                            platform: payload.platform || PLATFORM.PC_WEB,
                        },
                    })
                }
            })
        },
        // setup ({ dispatch, history }) {
        //     dispatch({ type: 'query',
        //         payload: {
        //             platform: PLATFORM.PC_WEB,
        //             page: 1,
        //             pageSize: 10,
        //         } })
        //     // history.listen((location) => {
        //     //     if (location.pathname === '/application') {
        //     //         dispatch({ type: 'query',
        //     //             payload: {
        //     //                 platform: PLATFORM.PC_WEB,
        //     //                 ...queryString.parse(location.search),
        //     //             } })
        //     //     }
        //     // })
        // },
    },

    effects: {
        * query ({ payload }, { call, put, select }) {
            const { filter = {} } = yield select(_ => _.application)

            const _payload = {
                ...filter,
                ...payload,
            }

            yield put({
                type: 'setFilter',
                payload: _payload,
            })
            const data = yield call(queryList, _payload)
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.data,
                        pagination: {
                            current: Number(_payload.page) || 1,
                            pageSize: Number(_payload.pageSize) || 10,
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
            const { pagination } = yield select(_ => _.application)

            const data = yield call(update, payload)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
            } else {
                throw data
            }
        },

        * prepareEdit ({ payload: app_id }, { call, put }) {
            console.log(app_id, query)
            const data = yield call(query, { app_id })
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
            const { pagination } = yield select(_ => _.application)

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

        changeTab (state, { payload }) {
            return { ...state, platform: payload }
        },

        showModal (state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },

    },
})
