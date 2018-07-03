import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import classnames from 'classnames'
import queryString from 'query-string'
import moment from 'moment/moment'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { toString as platformToString } from '../../constants/PLATFORM'

/* eslint-disable camelcase */

const List = ({ isMotion, location, ...tableProps }) => {
    location.query = queryString.parse(location.search)

    const columns = [
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            render: (date) => {
                const format = 'YYYY-MM-DD'
                return `${moment.utc(date).format(format)}`
            },
        },
        // {
        //     title: 'Slot Id',
        //     key: 'slot_id',
        //     dataIndex: 'slot_id',
        // },
        {
            title: 'Slot Name',
            key: 'slot_name',
            dataIndex: 'slot_name',
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform',
            render: platform => platformToString(platform),
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
        {
            title: 'Revenue',
            key: 'revenue',
            dataIndex: 'revenue',
            render: revenue => revenue,
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
                rowKey={record => (`${record.slot_id}_${record.platform}_${record.date}`)}
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
