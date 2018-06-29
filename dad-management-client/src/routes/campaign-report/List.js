import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import classnames from 'classnames'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { toString as platformToString } from '../../constants/PLATFORM'
import moment from 'moment/moment'

/* eslint-disable camelcase */

const List = ({ isMotion, location, ...tableProps }) => {
    location.query = queryString.parse(location.search)

    const columns = [
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            render: (date) => {
                const format = 'YYYY-MM-DD HH:mm'
                return `${moment.utc(date.start_time).format(format)}`
            },
        },
        {
            title: 'Campaign Id',
            key: 'camp_id',
            dataIndex: 'camp_id',
        },
        {
            title: 'Campaign Name',
            key: 'camp_name',
            dataIndex: 'camp_name',
        },
        {
            title: 'Platforms',
            dataIndex: 'platforms',
            key: 'platforms',
            render: platforms => (platforms || []).map(platform => platformToString(platform)).join(', '),
        },
        {
            title: 'Impression',
            dataIndex: 'impressions',
            key: 'impressions',
        },
        {
            title: 'Clicks',
            key: 'clicks',
            dataIndex: 'clicks',
        },
        {
            title: 'CTR',
            key: 'ctr',
            dataIndex: 'ctr',
            render: ctr => `${ctr} %`,
        },
    ]

    const getBodyWrapperProps = {
        page: location.query.page,
        current: tableProps.pagination.current,
    }

    const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

    return (
        <div>
            <Table
                {...tableProps}
                className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
                bordered
                // scroll={{ x: 1250 }}
                columns={columns}
                simple
                rowKey={record => (`${record.camp_id}_${record.platform}_${record.date}`)}
                getBodyWrapper={getBodyWrapper}
            />
        </div>
    )
}

List.propTypes = {
    isMotion: PropTypes.bool,
    location: PropTypes.object,
}

export default List
