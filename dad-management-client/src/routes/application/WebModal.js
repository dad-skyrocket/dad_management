/**
 * Modal
 *
 * @author hyczzhu
 */
import React from 'react'
import PropTypes from 'prop-types'
import {
    Form, Input, InputNumber, Modal, Select,
    Checkbox,
} from 'antd'

import initialCountryMap from '../../utils/country'
import { WEB_TYPE_LIST, toString as webTypeToString } from '../../constants/WEB_TYPE'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}

const countryText = (code, name) => `${name} (${code})`
const countryMap = {
    ...initialCountryMap,
}
Object.keys(countryMap).forEach((key) => {
    countryMap[key] = countryText(key, countryMap[key])
})
const countryReverseMap = {}
Object.keys(countryMap).forEach((key) => {
    countryReverseMap[countryMap[key]] = key
})
const COUNTRIES = Object.keys(countryMap).map(value => ({
    value,
    text: countryMap[value],
}))

/* eslint-disable react/no-multi-comp */

class CountrySelect extends React.Component {
    static propTypes = {
        value: PropTypes.shape({
            country: PropTypes.array,
            all: PropTypes.bool,
        }),
        onChange: PropTypes.func,
    }

    handleAllChange = (e) => {
        this.props.onChange({
            ...this.props.value,
            all: e.target.checked,
        })
    }

    handleChange = (selectedCountryNames = []) => {
        this.props.onChange({
            ...this.props.value,
            country: selectedCountryNames.map(text => countryReverseMap[text]),
        })
    }

    render () {
        const countryOptions = COUNTRIES.map((c) => {
            // const text = c.text
            return <Option key={c.value} value={c.text}>{ c.text }</Option>
        })

        const { all = true, country = [] } = (this.props.value || {})

        return (
            <span>
                <Checkbox checked={all} onChange={this.handleAllChange}>All</Checkbox>
                <Select
                    disabled={this.props.value.all}
                    mode="multiple"
                    // style={{ width: '100%' }}
                    placeholder="Choose Country"
                    onChange={this.handleChange}
                    value={country.map(value => countryMap[value])}
                >
                    { countryOptions }
                </Select>
            </span>
        )
    }
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
    slotList,
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
                camp_id: item.camp_id,
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
                <FormItem label="Web Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('web_type', {
                        initialValue: item.web_type || WEB_TYPE_LIST[0],
                        rules: [
                            {
                                required: true,
                                message: 'Please input campaign name',
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
                        initialValue: item.camp_url,
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
                    })(<Input />)}
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
    slotList: PropTypes.array,
    item: PropTypes.object,
    onOk: PropTypes.func,
}

export default Form.create()(modal)
