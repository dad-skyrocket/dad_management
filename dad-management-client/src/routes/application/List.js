import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { DropOption } from 'components'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onEditItem, onChangeStatus, ...tableProps }) => {
    const handleMenuClick = (record, e) => {
        switch (e.key) {
            case '1':
                onEditItem(record)
                break
            case '4': {
                confirm({
                    title: (
                        <div>
                            {'Are you sure you want to active this application?'}
                            <br /><br />
                            {'Campaign Name: '}{record.app_name}<br />{'Description: '}{record.app_desc}
                        </div>
                    ),
                    onOk () {
                        onChangeStatus(record.app_id, 'active')
                    },
                })
                break
            }
            case '5': {
                confirm({
                    title: (
                        <div>
                            {'Are you sure you want to pause this application?'}
                            <br /><br />
                            {'Campaign Name: '}{record.app_name}<br />{'Description: '}{record.app_desc}
                        </div>
                    ),
                    onOk () {
                        onChangeStatus(record.app_id, 'paused')
                    },
                })
                break
            }
            default:
        }
    }

    const columns = [{
        title: 'App Id',
        dataIndex: 'app_id',
        key: 'app_id',
        // render: app_id => <Link to={`application/${app_id}`}>{app_id}</Link>,
    }, {
        title: 'Url/Package Name',
        key: 'urlOrPackageName',
        render: (text, record) => {
            const { web_url, package_name } = record
            return web_url || package_name
        },
    }, {
        title: 'Name',
        dataIndex: 'app_name',
        key: 'app_name',
    }, {
        title: 'Type',
        dataIndex: 'app_type',
        key: 'app_type',
    }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            switch (status) {
                case 'active':
                    return 'Active'
                case 'pending':
                    return 'Pending'
                case 'paused':
                    return 'Paused'
                default:
                    return ''
            }
        },
    }, {
        title: 'Operations',
        key: 'operation',
        width: 100,
        render: (text, record) => {
            const { status } = record
            let menuOptions = []
            if (status === 'paused') {
                menuOptions.push({
                    key: '4',
                    name: 'Activate',
                })
            } else if (status === 'active') {
                menuOptions.push({
                    key: '5',
                    name: 'Pause',
                })
            } else if (status === 'pending') {
                menuOptions.push({
                    key: '4',
                    name: 'Activate',
                })
                menuOptions.push({
                    key: '5',
                    name: 'Pause',
                })
            }
            menuOptions = [
                ...menuOptions,
                {
                    key: '6',
                    isDivider: true,
                }, {
                    key: '1',
                    name: 'Edit',
                },
            ]
            return (
                <DropOption
                    onMenuClick={e => handleMenuClick(record, e)}
                    menuOptions={menuOptions}
                    // menuOptions={[{ key: '1', name: 'Edit' }, { key: '3', name: 'Duplicate' }, { key: '2', name: 'Delete' }]}
                />
            )
        },
    },]

    return (
        <div>
            <Table
                {...tableProps}
                bordered
                scroll={{ x: 1200 }}
                columns={columns}
                simple
                className={styles.table}
                rowKey={record => record.id}
            />
        </div>
    )
}

List.propTypes = {
    onEditItem: PropTypes.func,
    onChangeStatus: PropTypes.func,
}

export default List
