import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'

// 1. Initialize
const app = dva({
    ...createLoading({
        effects: true,
    }),
    history: createHistory(),
    onError (error, dispatch) {
        message.error(error.message)
        if (error.errorCode === 401) {
            setTimeout(() => {
                dispatch({
                    type: 'app/redirectToLogin',
                })
            }, 1000)
        }
    },
})

// 2. Model
app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
