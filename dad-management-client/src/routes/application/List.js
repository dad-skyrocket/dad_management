import React from 'react'
import { Table } from 'antd'
import styles from './List.less'

const List = ({ ...tableProps }) => {
    const columns = [{
        title: 'App Id',
        dataIndex: 'app_id',
        key: 'app_id',
    }, {
        title: 'Url/Package Name',
        dataIndex: 'urlOrPackageName',
    }, {
        title: 'Name',
        dataIndex: 'app_name',
    }, {
        title: 'Type',
        dataIndex: 'app_type',
    }, {
        title: 'Status',
        dataIndex: 'app_status',
    }]

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

export default List
