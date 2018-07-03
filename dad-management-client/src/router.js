import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
    const error = dynamic({
        app,
        component: () => import('./routes/error'),
    })
    const routes = [{
        path: '/application',
        models: () => [import('./models/application')],
        component: () => import('./routes/application/'),
    }, {
        path: '/application/:id/slots',
        models: () => [import('./models/application/slot')],
        component: () => import('./routes/application/slot'),
    }, {
        path: '/slot',
        models: () => [import('./models/slot')],
        component: () => import('./routes/slot/'),
    }, {
    //     path: '/dashboard',
    //     models: () => [import('./models/dashboard')],
    //     component: () => import('./routes/dashboard/'),
    // }, {
        path: '/campaign',
        models: () => [import('./models/campaign')],
        component: () => import('./routes/campaign/'),
    }, {
        path: '/campaign-report',
        models: () => [import('./models/campaign-report')],
        component: () => import('./routes/campaign-report/'),
    }, {
        path: '/slot-report',
        models: () => [import('./models/slot-report')],
        component: () => import('./routes/slot-report/'),
    }, {
        path: '/user',
        models: () => [import('./models/user')],
        component: () => import('./routes/user/'),
    }, {
        path: '/user/:id',
        models: () => [import('./models/user/detail')],
        component: () => import('./routes/user/detail/'),
    }, {
        path: '/login',
        models: () => [import('./models/login')],
        component: () => import('./routes/login/'),
    }, {
        path: '/request',
        component: () => import('./routes/request/'),
    }, {
        path: '/UIElement/iconfont',
        component: () => import('./routes/UIElement/iconfont/'),
    }, {
        path: '/UIElement/search',
        component: () => import('./routes/UIElement/search/'),
    }, {
        path: '/UIElement/dropOption',
        component: () => import('./routes/UIElement/dropOption/'),
    }, {
        path: '/UIElement/layer',
        component: () => import('./routes/UIElement/layer/'),
    }, {
        path: '/UIElement/dataTable',
        component: () => import('./routes/UIElement/dataTable/'),
    }, {
        path: '/UIElement/editor',
        component: () => import('./routes/UIElement/editor/'),
    }, {
        path: '/chart/lineChart',
        component: () => import('./routes/chart/lineChart/'),
    }, {
        path: '/chart/barChart',
        component: () => import('./routes/chart/barChart/'),
    }, {
        path: '/chart/areaChart',
        component: () => import('./routes/chart/areaChart/'),
    }]

    return (
        <ConnectedRouter history={history}>
            <App>
                <Switch>
                    <Route exact path="/" render={() => (<Redirect to="/campaign" />)} />
                    {
                        routes.map(({ path, ...dynamics }, key) => (
                            <Route key={key}
                                exact
                                path={path}
                                component={dynamic({
                                    app,
                                    ...dynamics,
                                })}
                            />
                        ))
                    }
                    <Route component={error} />
                </Switch>
            </App>
        </ConnectedRouter>
    )
}

Routers.propTypes = {
    history: PropTypes.object,
    app: PropTypes.object,
}

export default Routers
