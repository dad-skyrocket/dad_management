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
import { Page } from 'components'

import Filter from './Filter'
import Modal from './Modal'
import List from './List'

const ApplicationSlots = ({ isAdmin, applicationSlots, dispatch, loading, location }) => {
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
        isAdmin,
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
        onDeleteItem (id) {
            dispatch({
                type: 'applicationSlots/delete',
                payload: id,
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
                type: 'applicationSlots/showModal',
                payload: {
                    modalType: 'create',
                },
            })
        },
    }

    return (
        <Page inner>
            <Filter {...filterProps} />
            <List {...listProps} />
            {modalVisible && <Modal {...modalProps} />}
        </Page>
    )
}

ApplicationSlots.propTypes = {
    isAdmin: PropTypes.bool,
    applicationSlots: PropTypes.object,
    loading: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
}

export default connect(({ applicationSlots, loading, app }) => ({ applicationSlots, loading, isAdmin: app.isAdmin }))(ApplicationSlots)
