/**
 * offer.js
 *
 * @author hyczzhu
 */

import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { message } from 'antd'
import { queryList as queryOfferList, query, create, remove, update, duplicate } from 'services/campaign'
import { queryList as querySlotList } from 'services/slot'
import { pageModel } from './common'

const formatPrice = (priceInCent) => {
    priceInCent = parseInt(priceInCent, 10)
    return parseFloat((priceInCent / 100).toFixed(2))
}

const transformData = item => ({
    ...item,
    priceStr: `${formatPrice(item.price)} adc`,
    start_time_obj: moment(item.start_time),
    end_time_obj: moment(item.end_time),
})

export default modelExtend(pageModel, {
    namespace: 'campaign',

    state: {
        currentItem: {},
        modalVisible: false,
        modalType: 'create',
        selectedRowKeys: [],
        slotList: [],
        filter: {},
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/campaign') {
                    const payload = location.query || { page: 1, pageSize: 10 }
                    dispatch({
                        type: 'query',
                        payload,
                    })
                }
            })
        },
    },

    effects: {

        * query ({ payload = {} }, { call, put, select }) {
            const { slotList, filter = {} } = yield select(_ => _.campaign)

            if (!(slotList && slotList.length)) {
                yield put({
                    type: 'querySlots',
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
            const data = yield call(queryOfferList, _payload)
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

        * querySlots ({ payload = {} }, { call, put }) {
            try {
                const data = yield call(querySlotList, payload)
                if (data) {
                    yield put({
                        type: 'querySlotsSuccess',
                        payload: {
                            list: data.data || [],
                        },
                    })
                }
            } catch (e) {
                message.error('获取广告位失败, 请点击搜索重试')
            }
        },

        * delete ({ payload }, { call, put, select }) {
            const data = yield call(remove, { camp_id: payload })
            const { selectedRowKeys, pagination } = yield select(_ => _.campaign)
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

        * duplicate ({ payload }, { call, put, select }) {
            const data = yield call(duplicate, { camp_id: payload })
            const { pagination } = yield select(_ => _.campaign)
            if (data.success) {
                yield put({ type: 'query', payload: { page: 1, pageSize: pagination.pageSize } })
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
    },

    reducers: {
        setFilter (state, { payload }) {
            return { ...state, filter: payload }
        },

        querySlotsSuccess (state, { payload }) {
            return { ...state, slotList: payload.list }
        },

        showModal (state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },

    },
})
