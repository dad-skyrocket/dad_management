/**
 * index
 *
 * @author hyczzhu
 */
import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'querystring'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import Filter from './Filter'
import Modal from './Modal'
import List from './List'

import styles from './index.less'
import PLATFORM from '../../../constants/PLATFORM'

const ApplicationSlots = ({ applicationSlots, dispatch, loading, location }) => {
    const { application, list, pagination, currentItem, modalVisible, modalType, platform } = applicationSlots
    const { query = {}, pathname } = location

    const modalProps = {
        application,
        modalType,
        item: modalType === 'create' ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects['applicationSlots/update'],
        title: `${modalType === 'create' ? 'Create Slot' : 'Update Slot'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
            dispatch({
                type: `applicationSlots/${modalType}`,
                payload: {
                    ...data,
                    platform,
                },
            })
        },
        onCancel () {
            dispatch({
                type: 'applicationSlots/hideModal',
            })
        },
    }

    const listProps = {
        pagination,
        dataSource: list,
        loading: loading.effects['applicationSlots/query'],
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
        onEditItem (item) {
            dispatch({
                type: 'applicationSlots/prepareEdit',
                payload: item.slot_id,
            })
        },
        onChangeStatus (id, status) {
            dispatch({
                type: 'applicationSlots/changeStatus',
                payload: { slot_id: id, status },
            })
        },
    }

    const filterProps = {
        application,
        filter: {
            ...location.query,
        },
        onAdd () {
            dispatch({
                type: 'campaign/showModal',
                payload: {
                    modalType: 'create',
                },
            })
        },
    }

    return (
        <div className={styles.applicationSlots}>
            <Filter {...filterProps} />
            <List {...listProps} />
            {modalVisible && <Modal {...modalProps} />}
        </div>
    )
}

ApplicationSlots.propTypes = {
    applicationSlots: PropTypes.object,
    loading: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
}

export default connect(({ applicationSlots, loading }) => ({ applicationSlots, loading }))(ApplicationSlots)
