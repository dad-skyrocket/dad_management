/**
 * application
 *
 * @author hyczzhu
 */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { queryList, query, create, update, changeStatus } from 'services/application'
import { queryAll as queryPubAll } from 'services/publisher'
import { pageModel } from 'models/common'
// import queryString from 'query-string'
import PLATFORM from '../constants/PLATFORM'
import { message } from 'antd/lib/index'

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
        pubList: [], // for admin
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/application') {
                    const payload = {
                        // page: 1,
                        // pageSize: 10,
                        ...location.query,
                        ...queryString.parse(location.search),
                    }
                    // console.log(location, payload)
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
            const { isAdmin } = yield select(_ => _.app)
            const { filter = {}, platform, pubList } = yield select(_ => _.application)
            // console.log(filter, payload, platform)

            if (isAdmin && !(pubList && pubList.length)) {
                yield put({
                    type: 'queryPubs',
                })
            }

            const _payload = {
                ...filter,
                platform,
                ...payload,
            }

            yield put({
                type: 'changeTab',
                payload: _payload.platform,
            })
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
                            total: data.recordsFiltered,
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

        * queryPubs ({ payload = {} }, { call, put }) {
            try {
                const data = yield call(queryPubAll, payload)
                if (data) {
                    yield put({
                        type: 'queryPubsSuccess',
                        payload: {
                            list: data.data || [],
                        },
                    })
                }
            } catch (e) {
                message.error('Publishers query fails, please click search and try again')
            }
        },
    },

    reducers: {
        setFilter (state, { payload }) {
            return { ...state, filter: payload }
        },

        queryPubsSuccess (state, { payload }) {
            return { ...state, pubList: payload.list }
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
