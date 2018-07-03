/**
 * campaign.js
 *
 * @author hyczzhu
 */

import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { message } from 'antd'
import { queryList as queryCampaignList, query, create, remove, update, duplicate, changeStatus } from 'services/campaign'
import { queryAll as querySlotAll } from 'services/slot'
import { queryAll as queryAdvAll } from 'services/advertiser'
import { pageModel } from './common'
import eventEmitter from '../utils/eventEmitter'

const formatPrice = (priceInCent) => {
    priceInCent = parseInt(priceInCent, 10)
    return parseFloat((priceInCent / 100).toFixed(2))
}

const transformData = item => ({
    ...item,
    priceInDollar: item.price / 100,
    priceStr: `${formatPrice(item.price / 100)} adc`,
    start_time_obj: moment(item.start_time),
    end_time_obj: moment(item.end_time),
    country_obj: {
        country: item.country,
        all: !(item.country || []).length,
    },
})

const initialState =  {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    slotList: [],
    filter: {},
    advList: [], // for admin
}

export default modelExtend(pageModel, {
    namespace: 'campaign',

    state: initialState,

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/campaign') {
                    const payload = location.query || { page: 1, pageSize: 10 }
                    dispatch({
                        type: 'query',
                        payload,
                    })
                } else if (location.pathname === '/login') {

                }
            })

            eventEmitter.on('logout', () => {
                dispatch({
                    type: 'reset',
                })
            })
        },
    },

    effects: {

        * query ({ payload = {} }, { call, put, select }) {
            const { isAdmin } = yield select(_ => _.app)
            const { slotList, filter = {}, advList } = yield select(_ => _.campaign)

            if (!(slotList && slotList.length)) {
                yield put({
                    type: 'querySlots',
                })
            }

            if (isAdmin && !(advList && advList.length)) {
                yield put({
                    type: 'queryAdvs',
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
            const data = yield call(queryCampaignList, _payload)
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
                const data = yield call(querySlotAll, payload)
                if (data) {
                    yield put({
                        type: 'querySlotsSuccess',
                        payload: {
                            list: data.data || [],
                        },
                    })
                }
            } catch (e) {
                message.error('Slots query fails, please click search and try again')
            }
        },

        * queryAdvs ({ payload = {} }, { call, put }) {
            try {
                const data = yield call(queryAdvAll, payload)
                if (data) {
                    yield put({
                        type: 'queryAdvsSuccess',
                        payload: {
                            list: data.data || [],
                        },
                    })
                }
            } catch (e) {
                message.error('Advertisers query fails, please click search and try again')
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

        querySlotsSuccess (state, { payload }) {
            return { ...state, slotList: payload.list }
        },

        queryAdvsSuccess (state, { payload }) {
            return { ...state, advList: payload.list }
        },

        showModal (state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },

        reset (state) {
            return {
                ...state,
                ...initialState,
            }
        },

    },
})
