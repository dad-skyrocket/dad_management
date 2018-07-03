/**
 * slot-report
 *
 * @author hyczzhu
 */

import moment from 'moment'
import modelExtend from 'dva-model-extend'
// import { message } from 'antd'
import { queryList as queryReport, transformData } from 'services/slot-report'
import { queryAll as queryPubAll } from 'services/publisher'
import { message } from 'antd/lib/index'
import { pageModel } from './common'

export default modelExtend(pageModel, {
    namespace: 'slotReport',

    state: {
        list: [], // conversion list
        filter: {},
        pubList: [], // for admin
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/slot-report') {
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
            const { isAdmin } = yield select(_ => _.app)
            const { filter, pubList } = yield select(_ => _.slotReport)

            if (isAdmin && !(pubList && pubList.length)) {
                yield put({
                    type: 'queryPubs',
                })
            }

            const currentDate = moment().format('YYYY-MM-DD')
            const initial = {
                page: 1, pageSize: 10, start_date: currentDate, end_date: currentDate, timezone: 8, // eslint-disable-line
            }

            const _payload = {
                ...initial,
                ...filter,
                ...payload,
            }

            // console.log(filter, payload, _payload)

            yield put({
                type: 'setFilter',
                payload: _payload,
            })

            const data = yield call(queryReport, _payload)
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
                yield put({
                    type: 'updateState',
                    payload: data,
                })
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
                message.error('Advertisers query fails, please click search and try again')
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
    },
})
