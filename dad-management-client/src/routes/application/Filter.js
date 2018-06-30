import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Select } from 'antd'

const Search = Input.Search
const Option = Select.Option


// const Search = Input.Search
// const Option = Select.Option

const ColProps = {
    xs: 24,
    sm: 12,
    style: {
        marginBottom: 16,
    },
}

const TwoColProps = {
    ...ColProps,
    xl: 96,
}

const Filter = (
    {
        isAdmin,
        pubList,
        onAdd,
        onFilterChange,
        filter,
        form: {
            getFieldDecorator,
            getFieldsValue,
            setFieldsValue,
        },
    }) => {
    // const formatDate = (fields) => {
    //     fields.start_time = fields.start_time ? fields.start_time.format('YYYY-MM-DD') : undefined
    //     fields.end_time = fields.end_time ? fields.end_time.format('YYYY-MM-DD') : undefined
    // }

    const handleSubmit = () => {
        let fields = getFieldsValue()
        // formatDate(fields)
        onFilterChange(fields)
    }

    const handleReset = () => {
        const fields = getFieldsValue()
        for (let item in fields) {
            if ({}.hasOwnProperty.call(fields, item)) {
                if (fields[item] instanceof Array) {
                    fields[item] = []
                } else {
                    fields[item] = undefined
                }
            }
        }
        setFieldsValue(fields)
        handleSubmit()
    }

    // const handleChangeDate = (key, values) => {
    //     let fields = getFieldsValue()
    //     fields[key] = values
    //     formatDate(fields)
    //     onFilterChange(fields)
    // }

    const handleChangeSelect = (key, values) => {
        let fields = getFieldsValue()
        fields[key] = values
        // formatDate(fields)
        onFilterChange(fields)
    }

    const { app_id, app_name, status, pub_id } = filter

    return (
        <Row gutter={24}>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                {getFieldDecorator('app_id', { initialValue: app_id })(
                    <Search placeholder="Search for application id"
                            size="large"
                            onSearch={handleSubmit}
                    />)}
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                {getFieldDecorator('app_name', { initialValue: app_name })(
                    <Search placeholder="Search for application name"
                            size="large"
                            onSearch={handleSubmit}
                    />)}
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                <FilterItem label="Status">
                    {getFieldDecorator('status', { initialValue: status || 'all' })(
                        <Select style={{ width: '100%' }} size="large" onChange={handleChangeSelect.bind(null, 'status')}>
                            <Option value="all">All</Option>
                            <Option value="active">Active</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="paused">Paused</Option>
                        </Select>
                    )}
                </FilterItem>
            </Col>
            {
                isAdmin ?
                    <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }} sm={{ span: 12 }}>
                        <FilterItem label="Publishers">
                            {getFieldDecorator('pub_id', { initialValue: pub_id || 'all' })(
                                <Select style={{ width: '100%' }} size="large" onChange={handleChangeSelect.bind(null, 'pub_id')}>
                                    <Option value="all">All</Option>
                                    {
                                        (pubList || []).map(pub => <Option key={pub.pub_id} value={`${pub.pub_id}`}>{pub.pub_name}</Option>)
                                    }
                                </Select>
                            )}
                        </FilterItem>
                    </Col> : null
            }
            <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div>
                        <Button type="primary"
                                size="large"
                                className="margin-right"
                                onClick={handleSubmit}
                        >Search</Button>
                        <Button size="large" onClick={handleReset}>Reset</Button>
                    </div>
                    {/*
                        <div>
                            <Button size="large" type="ghost" onClick={onAdd}>Create</Button>
                        </div>
                        */
                    }
                </div>
            </Col>
        </Row>
    )
}

Filter.propTypes = {
    isAdmin: PropTypes.bool,
    pubList: PropTypes.array,
    onAdd: PropTypes.func,
    form: PropTypes.object,
    filter: PropTypes.object,
    onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
