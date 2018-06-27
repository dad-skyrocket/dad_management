/**
 * List
 *
 * @author hyczzhu
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import styles from './List.less'
import { toString as slotTypeToString } from '../../../constants/SLOT_TYPE'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, onChangeStatus, ...tableProps }) => {
    const handleMenuClick = (record, e) => {
        switch (e.key) {
            case '1':
                onEditItem(record)
                break
            case '2': {
                confirm({
                    title: <div>{'Are you sure you want to delete this slot?'}<br/><br/>{'Slot Name: '}{record.slot_name}<br />{'Description: '}{record.slot_desc}</div>,
                    onOk () {
                        onDeleteItem(record.slot_id)
                    },
                })
                break
            }
            case '4': {
                confirm({
                    title: (
                        <div>
                            {'Are you sure you want to active this slot?'}
                            <br /><br />
                            {'Slot Name: '}{record.slot_name}<br />{'Description: '}{record.slot_desc}
                        </div>
                    ),
                    onOk () {
                        onChangeStatus(record.slot_id, 'active')
                    },
                })
                break
            }
            case '5': {
                confirm({
                    title: (
                        <div>
                            {'Are you sure you want to pause this slot?'}
                            <br /><br />
                            {'Slot Name: '}{record.slot_name}<br />{'Description: '}{record.slot_desc}
                        </div>
                    ),
                    onOk () {
                        onChangeStatus(record.slot_id, 'paused')
                    },
                })
                break
            }
            default:
        }
    }

    const columns = [{
        title: 'Slot Id',
        dataIndex: 'slot_id',
        key: 'slot_id',
    }, {
        title: 'Name',
        dataIndex: 'slot_name',
        key: 'slot_name',
    }, {
        title: 'Type',
        key: 'slot_type',
        dataIndex: 'slot_type',
        render: (slot_type) => slotTypeToString(slot_type),
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
                // }, {
                //     key: '2',
                //     name: 'Delete',
                },
            ]
            return (
                <DropOption
                    onMenuClick={e => handleMenuClick(record, e)}
                    menuOptions={menuOptions}
                />
            )
        },
    }]

    return (
        <div>
            <Table
                {...tableProps}
                bordered
                // scroll={{ x: 1200 }}
                columns={columns}
                simple
                className={styles.table}
                rowKey={record => record.slot_id}
            />
        </div>
    )
}

List.propTypes = {
    onDeleteItem: PropTypes.func,
    onEditItem: PropTypes.func,
    onChangeStatus: PropTypes.func,
}

export default List
