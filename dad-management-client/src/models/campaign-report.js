/**
 * campaign-report
 *
 * @author hyczzhu
 */

import moment from 'moment'
import modelExtend from 'dva-model-extend'
// import { message } from 'antd'
import { queryList as queryReport, transformData } from 'services/campaign-report'
// import { queryList as querySlotList } from 'services/slot'
import { pageModel } from './common'

export default modelExtend(pageModel, {
    namespace: 'campaignReport',

    state: {
        list: [], // conversion list
        filter: {},
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/campaign-report') {
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
            const { filter } = yield select(_ => _.campaignReport)

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
    },

    reducers: {
        setFilter (state, { payload }) {
            return { ...state, filter: payload }
        },
    },
})
