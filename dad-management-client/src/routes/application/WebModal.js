/**
 * Modal
 *
 * @author hyczzhu
 */
import React from 'react'
import PropTypes from 'prop-types'
import {
    Form, Input, InputNumber, Modal, Select, Radio,
} from 'antd'
import CountrySelect from 'components/form/CountrySelect'

import { WEB_TYPE_LIST, toString as webTypeToString } from '../../constants/WEB_TYPE'

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
                web_type: data.web_type,
                web_url: data.web_url,
                pv: data.pv,
                uv: data.uv,
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
                <FormItem label="Web Name" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('app_name', {
                        initialValue: item.app_name,
                        rules: [
                            {
                                required: true,
                                message: 'Please input web name',
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
                <FormItem label="Web Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('web_type', {
                        initialValue: item.web_type || WEB_TYPE_LIST[0],
                        rules: [
                            {
                                required: true,
                                message: 'Please select web type',
                            },
                        ],
                    })(<Select>
                        {
                            WEB_TYPE_LIST.map(web_type => <Option key={web_type} value={web_type}>{ webTypeToString(web_type) }</Option>)
                        }
                    </Select>)}
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
                <FormItem label="Web Url" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('web_url', {
                        initialValue: item.web_url,
                        rules: [
                            {
                                required: true,
                                message: 'Please input web url',
                            },
                            {
                                type: 'url',
                                message: 'web url must be a valid url',
                            },
                        ],
                    })(<Input disabled={modalType === 'update'} />)}
                </FormItem>
                <FormItem label="PV" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('pv', {
                        initialValue: item.pv || 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input pv',
                            },
                        ],
                    })(<InputNumber
                        min={0}
                        step={1}
                        precision={0}
                    />)}
                </FormItem>
                <FormItem label="uv" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('uv', {
                        initialValue: item.uv || 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input uv',
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
