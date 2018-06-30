import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const Campaign = ({ location, dispatch, campaign, loading, isAdmin }) => {
    location.query = queryString.parse(location.search)
    const { list, pagination, currentItem, modalVisible, modalType, slotList, advList } = campaign
    const { pageSize } = pagination

    const modalProps = {
        isAdmin,
        advList,
        modalType,
        slotList,
        item: modalType === 'create' ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects['campaign/update'],
        title: `${modalType === 'create' ? 'Create Campaign' : 'Update Campaign'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
            dispatch({
                type: `campaign/${modalType}`,
                payload: data,
            })
        },
        onCancel () {
            dispatch({
                type: 'campaign/hideModal',
            })
        },
    }

    const listProps = {
        dataSource: list,
        slotList,
        loading: loading.effects['campaign/query'],
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
        onDeleteItem (id) {
            dispatch({
                type: 'campaign/delete',
                payload: id,
            })
        },
        onEditItem (item) {
            dispatch({
                type: 'campaign/prepareEdit',
                payload: item.camp_id,
            })
        },
        onDuplicateItem (id) {
            dispatch({
                type: 'campaign/duplicate',
                payload: id,
            })
        },
        onChangeStatus (id, status) {
            dispatch({
                type: 'campaign/changeStatus',
                payload: { camp_id: id, status },
            })
        },
    }

    const filterProps = {
        isAdmin,
        advList: campaign.advList,
        filter: {
            ...location.query,
        },
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
        onSearch (fieldsValue) {
            fieldsValue.keyword.length ? dispatch(routerRedux.push({
                pathname: '/campaign',
                query: {
                    field: fieldsValue.field,
                    keyword: fieldsValue.keyword,
                },
            })) : dispatch(routerRedux.push({
                pathname: '/campaign',
            }))
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
        <Page inner>
            <Filter {...filterProps} />
            <List {...listProps} />
            {modalVisible && <Modal {...modalProps} />}
        </Page>
    )
}

Campaign.propTypes = {
    isAdmin: PropTypes.bool,
    campaign: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
}

export default connect(({ campaign, loading, app }) => ({ campaign, loading, isAdmin: app.isAdmin }))(Campaign)
