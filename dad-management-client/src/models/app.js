/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout } from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'

const { prefix } = config

export default {
    namespace: 'app',
    state: {
        user: {},
        permissions: {
            visit: [],
        },
        menu: [
            // {
            //     id: 1,
            //     icon: 'laptop',
            //     name: 'Dashboard',
            //     router: '/dashboard',
            // },
        ],
        breadcrumb: [],
        menuPopoverVisible: false,
        siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
        darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
        isNavbar: document.body.clientWidth < 769,
        navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
        locationPathname: '',
        locationQuery: {},
    },
    subscriptions: {

        setupHistory ({ dispatch, history }) {
            history.listen((location) => {
                dispatch({
                    type: 'updateState',
                    payload: {
                        locationPathname: location.pathname,
                        locationQuery: queryString.parse(location.search),
                    },
                })
            })
        },

        setup ({ dispatch }) {
            dispatch({ type: 'query' })
            let tid
            window.onresize = () => {
                clearTimeout(tid)
                tid = setTimeout(() => {
                    dispatch({ type: 'changeNavbar' })
                }, 300)
            }
        },

    },
    effects: {

        * redirectToLogin (action, { put, select }) {
            const { locationPathname } = yield select(_ => _.app)
            yield put(routerRedux.push({
                pathname: '/login',
                search: queryString.stringify({
                    from: locationPathname,
                }),
            }))
        },

        * query ({ payload }, { call, put, select }) {
            const { success, user } = yield call(query, payload)
            const { locationPathname } = yield select(_ => _.app)
            if (success && user) {
                const { list } = yield call(menusService.query)
                const { permissions } = user
                let menu = list
                // The roles who can visit all menus in list
                // if (permissions.role === EnumRoleType.ADMIN
                //     || permissions.role === EnumRoleType.SENIOR_MANAGER
                //     || permissions.role === EnumRoleType.DEVELOPER) {
                permissions.visit = list.map(item => item.id)
                // } else {
                //     // Filter the menus based on permissions.visit
                //     menu = list.filter((item) => {
                //         const cases = [
                //             permissions.visit.includes(item.id),
                //             item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
                //             item.bpid ? permissions.visit.includes(item.bpid) : true,
                //         ]
                //         return cases.every(_ => _)
                //     })
                // }
                yield put({
                    type: 'updateState',
                    payload: {
                        user,
                        permissions,
                        menu,
                    },
                })
                if (location.pathname === '/login') {
                    yield put(routerRedux.push({
                        pathname: '/campaign',
                    }))
                } else if (location.pathname === '/') {
                    yield put(routerRedux.push({
                        pathname: '/campaign',
                    }))
                }
            } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
                yield put({ type: 'redirectToLogin' })
            }
        },

        * logout ({ payload }, { call, put }) {
            const data = yield call(logout, parse(payload))
            if (data.success) {
                yield put({ type: 'redirectToLogin' })
            } else {
                throw (data)
            }
        },

        * changeNavbar (action, { put, select }) {
            const { app } = yield (select(_ => _))
            const isNavbar = document.body.clientWidth < 769
            if (isNavbar !== app.isNavbar) {
                yield put({ type: 'handleNavbar', payload: isNavbar })
            }
        },

    },
    reducers: {
        updateState (state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },

        switchSider (state) {
            window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
            return {
                ...state,
                siderFold: !state.siderFold,
            }
        },

        switchTheme (state) {
            window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
            return {
                ...state,
                darkTheme: !state.darkTheme,
            }
        },

        switchMenuPopver (state) {
            return {
                ...state,
                menuPopoverVisible: !state.menuPopoverVisible,
            }
        },

        handleNavbar (state, { payload }) {
            return {
                ...state,
                isNavbar: payload,
            }
        },

        handleNavOpenKeys (state, { payload: navOpenKeys }) {
            return {
                ...state,
                ...navOpenKeys,
            }
        },
    },
}
