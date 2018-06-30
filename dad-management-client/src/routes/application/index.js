import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'querystring'
import { connect } from 'dva'
import { Tabs, Button } from 'antd'
import { routerRedux } from 'dva/router'
import { Page } from 'components'

import PLATFORM, { toString as platformToString } from '../../constants/PLATFORM'

import Filter from './Filter'
import List from './List'
import WebModal from './WebModal'
import MobileAppModal from './MobileAppModal'

const TabPane = Tabs.TabPane

const Application = ({ isAdmin, application, dispatch, loading, location }) => {
    const { list, pagination, currentItem, modalVisible, modalType, platform, pubList } = application
    const { query = {}, pathname } = location
    const { pageSize } = pagination

    const modalProps = {
        isAdmin,
        pubList,
        modalType,
        item: modalType === 'create' ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects['application/update'],
        title: `${modalType === 'create' ? `Create Application for ${platformToString(platform)}` : 'Update Application'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
            dispatch({
                type: `application/${modalType}`,
                payload: {
                    ...data,
                    platform,
                },
            })
        },
        onCancel () {
            dispatch({
                type: 'application/hideModal',
            })
        },
    }

    const listProps = {
        platform,
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
        dispatch({
            type: 'application/changeTab',
            payload: key,
        })
        dispatch(routerRedux.push({
            pathname,
            search: queryString.stringify({
                ...query,
                platform: key,
                page: 1,
            }),
        }))
    }

    const operations = <Button onClick={handleCreate}>Create</Button>

    // console.log(platform)

    const filterProps = {
        isAdmin,
        pubList,
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
        onAdd () {
            dispatch({
                type: 'application/showModal',
                payload: {
                    modalType: 'create',
                },
            })
        },
    }

    return (
        <Page inner>
            <Filter {...filterProps} />
            <Tabs activeKey={platform || PLATFORM.PC_WEB} onTabClick={handleTabClick} tabBarExtraContent={operations}>
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
            {modalVisible && platform !== PLATFORM.MOBILE_APP && <WebModal {...modalProps} />}
            {modalVisible && platform === PLATFORM.MOBILE_APP && <MobileAppModal {...modalProps} />}
        </Page>
    )
}

Application.propTypes = {
    isAdmin: PropTypes.bool,
    application: PropTypes.object,
    loading: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
}

export default connect(({ application, loading, app }) => ({ application, loading, isAdmin: app.isAdmin }))(Application)
