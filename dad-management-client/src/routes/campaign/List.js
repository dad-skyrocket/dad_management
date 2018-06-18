import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import cn from 'classnames'
import { DropOption } from 'components'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDuplicateItem, onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
    location.query = queryString.parse(location.search)

    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            onEditItem(record)
        } else if (e.key === '2') {
            confirm({
                title: <div>{'确定要删除此投放吗?'}<br /><br />{'投放名: '}{record.camp_name}<br />{'投放描述: '}{record.camp_desc}</div>,
                onOk () {
                    onDeleteItem(record.camp_id)
                },
            })
        } else if (e.key === '3') {
            confirm({
                title: <div>{'确定要复制此投放吗?'}<br /><br />{'投放名: '}{record.camp_name}<br />{'投放描述: '}{record.camp_desc}</div>,
                onOk () {
                    onDuplicateItem(record.camp_id)
                },
            })
        }
    }

    const columns = [
        {
            title: '投放名称',
            dataIndex: 'camp_name',
            key: 'camp_name',
        },
        {
            title: '投放状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                switch (status) {
                    case 'active':
                        return '正常'
                    case 'pending':
                        return '审核中'
                    case 'paused':
                        return '暂停'
                    default:
                        return ''
                }
            },
        },
        {
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
            render: platform => (platform || []).join(', '),
        },
        {
            title: 'country',
            dataIndex: 'country',
            key: 'country',
            render: country => (country || []).join(', '),
        },
        {
            title: 'payment method',
            dataIndex: 'payment_method',
            key: 'payment_method',
        },
        {
            title: 'duration',
            key: 'duration',
            render: (text, record) => {
                return `${record.start_time} ~ ${record.end_time}`
            },
        },
        {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                return (
                    <DropOption onMenuClick={e => handleMenuClick(record, e)}
                        menuOptions={[{ key: '1', name: '修改' }, { key: '3', name: '复制' }, { key: '2', name: '删除' }]}
                    />
                )
            },
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
                className={cn({ [styles.table]: true, [styles.motion]: isMotion })}
                bordered
                scroll={{ x: 1250 }}
                columns={columns}
                simple
                rowKey={record => record.camp_id}
                getBodyWrapper={getBodyWrapper}
            />
        </div>
    )
}

List.propTypes = {
    onDuplicateItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
    onEditItem: PropTypes.func,
    isMotion: PropTypes.bool,
    location: PropTypes.object,
}

export default List
