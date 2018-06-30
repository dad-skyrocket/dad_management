import { routerRedux } from 'dva/router'
import { login } from 'services/login'
import { getDefaultEntrance } from 'services/app'

export default {
    namespace: 'login',

    state: {},

    effects: {
        * login ({
            payload,
        }, { put, call, select }) {
            const data = yield call(login, payload)
            const { locationQuery, user } = yield select(_ => _.app)
            if (data.success) {
                const { from } = locationQuery
                yield put({ type: 'app/query' })
                if (from && from !== '/login') {
                    yield put(routerRedux.push(from))
                } else {
                    let defaultEntrance = getDefaultEntrance(user)
                    yield put(routerRedux.push(defaultEntrance))
                }
            } else {
                throw data
            }
        },
    },

}
