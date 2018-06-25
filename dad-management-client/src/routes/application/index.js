import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'querystring'
import { connect } from 'dva'
import { Tabs, Button } from 'antd'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import List from './List'
import WebModal from './WebModal'
import PLATFORM from '../../constants/PLATFORM'

const TabPane = Tabs.TabPane

const Application = ({ application, dispatch, loading, location }) => {
    const { list, pagination, currentItem, modalVisible, modalType } = application
    const { query = {}, pathname } = location

    const modalProps = {
        modalType,
        item: modalType === 'create' ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects['application/update'],
        title: `${modalType === 'create' ? 'Create Application' : 'Update Application'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
            dispatch({
                type: `application/${modalType}`,
                payload: data,
            })
        },
        onCancel () {
            dispatch({
                type: 'application/hideModal',
            })
        },
    }

    const listProps = {
        pagination,
        dataSource: list,
        loading: loading.effects['application/query'],
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
                type: 'application/prepareEdit',
                payload: item.app_id,
            })
        },
        onChangeStatus (id, status) {
            dispatch({
                type: 'application/changeStatus',
                payload: { app_id: id, status },
            })
        },
    }

    const handleCreate = () => {
        dispatch({
            type: 'application/showModal',
            payload: {
                modalType: 'create',
            },
        })
    }

    const handleTabClick = (key) => {
        dispatch(routerRedux.push({
            pathname,
            query: {
                status: key,
            },
        }))
    }

    const operations = <Button onClick={handleCreate}>Create</Button>

    return (
        <Page inner>
            <Tabs activeKey={query.status || PLATFORM.PC_WEB} onTabClick={handleTabClick} tabBarExtraContent={operations}>
                <TabPane tab="PC Web" key={PLATFORM.PC_WEB}>
                    <List {...listProps} />
                </TabPane>
                <TabPane tab="Wap Web" key={PLATFORM.WAP_WEB}>
                    <List {...listProps} />
                </TabPane>
                <TabPane tab="Mobile App" key={PLATFORM.MOBILE_APP}>
                    <List {...listProps} />
                </TabPane>
            </Tabs>
            {modalVisible && <WebModal {...modalProps} />}
        </Page>
    )
}

Application.propTypes = {
    application: PropTypes.object,
    loading: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
}

export default connect(({ application, loading }) => ({ application, loading }))(Application)
