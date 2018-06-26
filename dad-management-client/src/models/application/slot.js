/**
 * slot
 *
 * @author hyczzhu
 */
import pathToRegexp from 'path-to-regexp'
import modelExtend from 'dva-model-extend'
import { message } from 'antd/lib/index'
import { queryList, query, create, update, remove, changeStatus } from '../../services/slot'
import { query as queryApplication } from '../../services/application'
import { pageModel } from '../common'

const transformData = item => item

export default modelExtend(pageModel, {

    namespace: 'applicationSlots',

    state: {
        application: null,
        currentItem: {},
        modalVisible: false,
        modalType: 'create',
        selectedRowKeys: [],
        filter: {},
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(({ pathname }) => {
                const match = pathToRegexp('/application/:id/slots').exec(pathname)
                if (match) {
                    dispatch({ type: 'query', payload: { app_id: match[1] } })
                }
            })
        },
    },

    effects: {
        * query ({ payload }, { call, put, select }) {
            const { application, filter = {} } = yield select(_ => _.applicationSlots)

            if (!(application)) {
                yield put({
                    type: 'queryApplication',
                    payload: {
                        app_id: payload.app_id,
                    },
                })
            }

            const _payload = {
                ...filter,
                ...payload,
            }

            yield put({
                type: 'setFilter',
                payload: _payload,
            })

            const data = yield call(queryList, payload)
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: (data.data || []).map(item => transformData(item)),
                        pagination: {
                            current: Number(_payload.page) || 1,
                            pageSize: Number(_payload.pageSize) || 10,
                            total: data.recordsFiltered,
                        },
                    },
                })
            }
        },

        * queryApplication ({ payload = {} }, { call, put }) {
            try {
                const data = yield call(queryApplication, payload)
                if (data) {
                    yield put({
                        type: 'queryApplicationSuccess',
                        payload: {
                            data,
                        },
                    })
                }
            } catch (e) {
                message.error('Query application info fail, please try again later')
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
            const { pagination } = yield select(_ => _.applicationSlots)
            console.log(payload)

            const data = yield call(update, payload)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
            } else {
                throw data
            }
        },

        * prepareEdit ({ payload: slot_id }, { call, put }) {
            const data = yield call(query, { slot_id })
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
            const { pagination } = yield select(_ => _.applicationSlots)

            const data = yield call(changeStatus, payload)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
            } else {
                throw data
            }
        },

        * delete ({ payload }, { call, put, select }) {
            const data = yield call(remove, { slot_id: payload })
            const { selectedRowKeys, pagination } = yield select(_ => _.applicationSlots)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) },
                })
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

        queryApplicationSuccess (state, { payload }) {
            return { ...state, application: payload.data }
        },

        showModal (state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },
    },
})
