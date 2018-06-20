import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'querystring'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import List from './List'
import PLATFORM from '../../constants/PLATFORM'

const TabPane = Tabs.TabPane

const Application = ({ application, dispatch, loading, location }) => {
    const { list, pagination } = application
    const { query = {}, pathname } = location

    const listProps = {
        pagination,
        dataSource: list,
        loading: loading.effects['application/query'],
        onChange (page) {
            dispatch(routerRedux.push({
                pathname,
                search: queryString.stringify({
                    ...query,
                    page: page.current,
                    pageSize: page.pageSize,
                }),
            }))
        },
    }

    const handleTabClick = (key) => {
        dispatch(routerRedux.push({
            pathname,
            query: {
                status: key,
            },
        }))
    }

    return (
        <Page inner>
            <Tabs activeKey={query.status || PLATFORM.PC_WEB} onTabClick={handleTabClick}>
                <TabPane tab="PC Web" key={PLATFORM.PC_WEB}>
                    <List {...listProps} />
                </TabPane>
                <TabPane tab="Wap Web" key={PLATFORM.WAP_WEB}>
                    <List {...listProps} />
                </TabPane>
                <TabPane tab="Mobile App" key={PLATFORM.MOBILE_APP}>
                    <List {...listProps} />
                </TabPane>
            </Tabs>
        </Page>
    )
}

Application.propTypes = {
    application: PropTypes.object,
    loading: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
}

export default connect(({ application, loading }) => ({ application, loading }))(Application)
