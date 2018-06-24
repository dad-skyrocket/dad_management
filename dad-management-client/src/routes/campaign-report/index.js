import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'

const CampaignReport = ({ location, dispatch, report, loading }) => {
    location.query = queryString.parse(location.search)
    const { list, pagination, affiliateList } = report
    const { pageSize } = pagination

    const listProps = {
        affiliateList,
        dataSource: list,
        loading: loading.effects['campaign-report/query'],
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
        filter: {
            ...location.query,
        },
        affiliateList,
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

CampaignReport.propTypes = {
    report: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
}

export default connect(({ campaignReport, loading }) => ({ report: campaignReport, loading }))(CampaignReport)
