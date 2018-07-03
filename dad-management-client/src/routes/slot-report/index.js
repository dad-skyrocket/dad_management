import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'

const SlotReport = ({ location, dispatch, report, loading, isAdmin }) => {
    location.query = queryString.parse(location.search)
    const { list, pagination, pubList } = report
    const { pageSize } = pagination

    const listProps = {
        dataSource: list,
        loading: loading.effects['slot-report/query'],
        pagination,
        location,
        onChange (page) {
            const { query, pathname } = location
            dispatch(routerRedux.push({
                pathname,
                query: {
                    ...query,
                    page: page.current,
                    pageSize: page.pageSize,
                },
            }))
        },
    }

    const filterProps = {
        isAdmin,
        pubList,
        filter: {
            ...location.query,
        },
        onFilterChange (value) {
            dispatch(routerRedux.push({
                pathname: location.pathname,
                query: {
                    ...value,
                    page: 1,
                    pageSize,
                },
            }))
        },
    }

    return (
        <Page inner>
            <Filter {...filterProps} />
            <List {...listProps} />
        </Page>
    )
}

SlotReport.propTypes = {
    isAdmin: PropTypes.bool,
    report: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
}

export default connect(({ slotReport, loading, app }) => ({ report: slotReport, loading, isAdmin: app.isAdmin }))(SlotReport)
