import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import cn from 'classnames'
import moment from 'moment'
import { DropOption } from 'components'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { toString as platformToString } from '../../constants/PLATFORM'

const confirm = Modal.confirm

const List = ({ onDuplicateItem, onDeleteItem, onEditItem, onChangeStatus, isMotion, location, slotList = [], ...tableProps }) => {
    location.query = queryString.parse(location.search)

    const handleMenuClick = (record, e) => {
        switch (e.key) {
            case '1':
                onEditItem(record)
                break
            case '2': {
                confirm({
                    title: <div>{'Are you sure you want to delete this campaign?'}<br/><br/>{'Campaign Name: '}{record.camp_name}<br />{'Description: '}{record.camp_desc}</div>,
                    onOk () {
                        onDeleteItem(record.camp_id)
                    },
                })
                break
            }
            case '3': {
                confirm({
                    title: <div>{'Are you sure you want to duplicate this campaign??'}<br/><br/>{'Campaign: '}{record.camp_name}<br />{'Description: '}{record.camp_desc}</div>,
                    onOk () {
                        onDuplicateItem(record.camp_id)
                    },
                })
                break
            }
            case '4': {
                confirm({
                    title: (
                        <div>
                            {'Are you sure you want to active this campaign?'}
                            <br /><br />
                            {'Campaign Name: '}{record.camp_name}<br />{'Description: '}{record.camp_desc}
                        </div>
                    ),
                    onOk () {
                        onChangeStatus(record.camp_id, 'active')
                    },
                })
                break
            }
            case '5': {
                confirm({
                    title: (
                        <div>
                            {'Are you sure you want to pause this campaign?'}
                            <br /><br />
                            {'Campaign Name: '}{record.camp_name}<br />{'Description: '}{record.camp_desc}
                        </div>
                    ),
                    onOk () {
                        onChangeStatus(record.camp_id, 'paused')
                    },
                })
                break
            }
            default:
        }
    }

    const slotMap = {}
    slotList.forEach((slot) => {
        slotMap[slot.slot_id] = slot
    })

    const columns = [
        {
            title: 'Campaign Name',
            dataIndex: 'camp_name',
            key: 'camp_name',
        },
        {
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
        },
        {
            title: 'Platform',
            key: 'platform',
            render: (text, record) => {
                const { slot_ids: slotIds } = record
                const platformMap = {}
                slotIds.forEach((slotId) => {
                    const slot = slotMap[slotId]
                    if (!platformMap[slot.platform]) {
                        platformMap[slot.platform] = true
                    }
                })

                return Object.keys(platformMap).map(platform => platformToString(platform)).join(', ')
            },
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: country => (country || []).join(', ') || 'All',
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
        },
        // {
        //     title: 'Duration',
        //     key: 'duration',
        //     render: (text, record) => {
        //         const format = 'YYYY-MM-DD HH:mm ZZ'
        //         return `${moment.utc(record.start_time).format(format)} ~ ${moment.utc(record.end_time).format(format)}`
        //     },
        // },
        {
            title: 'Start Time',
            key: 'startTime',
            render: (text, record) => {
                const format = 'YYYY-MM-DD HH:mm ZZ'
                return `${moment.utc(record.start_time).format(format)}`
            },
        },
        {
            title: 'End Time',
            key: 'endTime',
            render: (text, record) => {
                const format = 'YYYY-MM-DD HH:mm ZZ'
                return `${moment.utc(record.end_time).format(format)}`
            },
        },
        {
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
                    }, {
                        key: '3',
                        name: 'Duplicate',
                    }, {
                        key: '2',
                        name: 'Delete',
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
    onChangeStatus: PropTypes.func,
    isMotion: PropTypes.bool,
    location: PropTypes.object,
    slotList: PropTypes.array,
}

export default List
