/**
 * MobileAppModal
 *
 * @author hyczzhu
 */
import React from 'react'
import PropTypes from 'prop-types'
import CountrySelect from 'components/form/CountrySelect'
import {
    Form, Input, InputNumber, Modal, Select, Radio,
} from 'antd'

import { APP_TYPE_LIST, toString as appTypeToString } from '../../constants/APP_TYPE'

const FormItem = Form.Item
const Option = Select.Option
const RadioButton = Radio.Button

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}

const modal = ({
                   item = {},
                   onOk,
                   form: {
                       getFieldDecorator,
                       validateFields,
                       getFieldsValue,
                   },
                   modalType,
                   ...modalProps
               }) => {
    const handleOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
                key: item.key,
                app_id: item.app_id,
            }
            data.country = data.country_obj.all ? [] : data.country_obj.country
            data.app_info = {
                app_type: data.app_type,
                app_platform: data.app_platform,
                package_name: data.package_name,
                store_url: data.store_url,
                dau: data.dau,
            }
            // console.log(data)
            onOk(data)
        })
    }

    const modalOpts = {
        ...modalProps,
        onOk: handleOk,
    }

    return (
        <Modal width={760} {...modalOpts}>
            <Form layout="horizontal">
                <FormItem label="App Name" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('app_name', {
                        initialValue: item.app_name,
                        rules: [
                            {
                                required: true,
                                message: 'Please input app name',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Description" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('app_desc', {
                        initialValue: item.app_desc,
                    })(<Input />)}
                </FormItem>
                {
                    modalType === 'update' &&
                    <FormItem label="Status" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('status', {
                            initialValue: item.status || 'pending',
                            rules: [
                                {
                                    required: true,
                                    message: 'Please choose status',
                                },
                            ],
                        })(
                            <Radio.Group>
                                <RadioButton value="active">Active</RadioButton>
                                <RadioButton value="pending">Pending</RadioButton>
                                <RadioButton value="paused">Paused</RadioButton>
                            </Radio.Group>
                        )}
                    </FormItem>
                }
                <FormItem label="App Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('app_type', {
                        initialValue: item.app_type || APP_TYPE_LIST[0],
                        rules: [
                            {
                                required: true,
                                message: 'Please select app type',
                            },
                        ],
                    })(<Select>
                        {
                            APP_TYPE_LIST.map(app_type => <Option key={app_type} value={app_type}>{ appTypeToString(app_type) }</Option>)
                        }
                    </Select>)}
                </FormItem>
                <FormItem label="App Platform" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('app_platform', {
                        initialValue: item.app_platform || 'ios',
                        rules: [
                            {
                                required: true,
                                message: 'Please choose app platform',
                            },
                        ],
                    })(
                        <Radio.Group disabled={modalType === 'update'} >
                            <RadioButton value="ios">IOS</RadioButton>
                            <RadioButton value="android">Android</RadioButton>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem label="Package Name" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('package_name', {
                        initialValue: item.package_name,
                        rules: [
                            {
                                required: true,
                                message: 'Please input package name',
                            },
                        ],
                    })(<Input disabled={modalType === 'update'} />)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Countries"
                >
                    {getFieldDecorator('country_obj', {
                        initialValue: item.country_obj || { country: [], all: true },
                        rules: [
                            {
                                required: true,
                                message: 'Please choose at least a country',
                            },
                        ],
                    })(
                        <CountrySelect />
                    )}
                </FormItem>
                <FormItem label="Store Url" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('store_url', {
                        initialValue: item.store_url,
                        rules: [
                            {
                                required: true,
                                message: 'Please input store url',
                            },
                            {
                                type: 'url',
                                message: 'store url must be a valid url',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="DAU" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('dau', {
                        initialValue: item.dau || 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input dau',
                            },
                        ],
                    })(<InputNumber
                        min={0}
                        step={1}
                        precision={0}
                    />)}
                </FormItem>
            </Form>
        </Modal>
    )
}

modal.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    modalType: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
}

export default Form.create()(modal)
