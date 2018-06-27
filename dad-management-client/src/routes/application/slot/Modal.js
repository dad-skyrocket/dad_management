/**
 * WebModal
 *
 * @author hyczzhu
 */
import React from 'react'
import PropTypes from 'prop-types'
import {
    Form, Input, InputNumber, Modal, Select, Radio,
} from 'antd'

import { SLOT_TYPE_LIST, toString as slotTypeToString } from '../../../constants/SLOT_TYPE'

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

const modal = (
    {
        application,
        item = {},
        onOk,
        form: {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
        },
        modalType,
        ...modalProps
    }
) => {
    const handleOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
                key: item.key,
                slot_id: item.slot_id,
                app_id: application.app_id,
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
                <div>{ application.app_name }</div>
                <FormItem label="Slot Name" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('slot_name', {
                        initialValue: item.slot_name,
                        rules: [
                            {
                                required: true,
                                message: 'Please input slot name',
                            },
                        ],
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
                <FormItem label="Slot Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('slot_type', {
                        initialValue: item.slot_type || SLOT_TYPE_LIST[0],
                        rules: [
                            {
                                required: true,
                                message: 'Please select slot type',
                            },
                        ],
                    })(<Select disabled={modalType === 'update' }>
                        {
                            SLOT_TYPE_LIST.map(slot_type => <Option key={slot_type} value={slot_type}>{ slotTypeToString(slot_type) }</Option>)
                        }
                    </Select>)}
                </FormItem>
                <FormItem label="Width" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('slot_width', {
                        initialValue: item.slot_width || 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input slot width',
                            },
                        ],
                    })(<InputNumber
                        min={0}
                        step={1}
                        precision={0}
                        disabled={modalType === 'update'}
                    />)}
                    px
                </FormItem>
                <FormItem label="Height" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('slot_height', {
                        initialValue: item.slot_height || 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input slot height',
                            },
                        ],
                    })(<InputNumber
                        min={0}
                        step={1}
                        precision={0}
                        disabled={modalType === 'update'}
                    />)}
                    px
                </FormItem>
                <FormItem label="Impression" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('impression', {
                        initialValue: item.impression || 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input impression',
                            },
                        ],
                    })(<InputNumber
                        min={0}
                        step={1}
                        precision={0}
                    />)}
                </FormItem>
                <FormItem label="CTR" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('ctr', {
                        initialValue: item.ctr || 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input CTR',
                            },
                        ],
                    })(<InputNumber
                        min={0}
                        step={1}
                        precision={2}
                    />)}
                    %
                </FormItem>
            </Form>
        </Modal>
    )
}

modal.propTypes = {
    application: PropTypes.object,
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    modalType: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
}

export default Form.create()(modal)
