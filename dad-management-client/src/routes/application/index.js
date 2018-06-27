import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'querystring'
import { connect } from 'dva'
import { Tabs, Button } from 'antd'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import List from './List'
import WebModal from './WebModal'
import MobileAppModal from './MobileAppModal'
import PLATFORM from '../../constants/PLATFORM'

const TabPane = Tabs.TabPane

const Application = ({ application, dispatch, loading, location }) => {
    const { list, pagination, currentItem, modalVisible, modalType, platform } = application
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

    return (
        <Page inner>
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
    application: PropTypes.object,
    loading: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
}

export default connect(({ application, loading }) => ({ application, loading }))(Application)
