import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Select } from 'antd'

const Search = Input.Search
const Option = Select.Option

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

const Filter = ({
    onAdd,
    onFilterChange,
    filter,
    form: {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
    },
}) => {
    const formatDate = (fields) => {
        fields.create_date = fields.create_date ? fields.create_date.format('YYYY-MM-DD') : undefined
        fields.expiration_date = fields.expiration_date ? fields.expiration_date.format('YYYY-MM-DD') : undefined
    }

    const handleSubmit = () => {
        let fields = getFieldsValue()
        formatDate(fields)
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

    const handleChangeDate = (key, values) => {
        let fields = getFieldsValue()
        fields[key] = values
        formatDate(fields)
        onFilterChange(fields)
    }

    const handleChangeSelect = (key, values) => {
        let fields = getFieldsValue()
        fields[key] = values
        formatDate(fields)
        onFilterChange(fields)
    }

    const { camp_id, camp_name, status, create_date, expiration_date } = filter

    return (
        <Row gutter={24}>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                {getFieldDecorator('camp_id', { initialValue: camp_id })(<Search placeholder="搜索投放Id"
                    size="large"
                    onSearch={handleSubmit}
                />)}
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                {getFieldDecorator('camp_name', { initialValue: camp_name })(<Search placeholder="搜索投放名"
                    size="large"
                    onSearch={handleSubmit}
                />)}
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                <FilterItem label="投放状态">
                    {getFieldDecorator('status', { initialValue: status || 'all' })(
                        <Select style={{ width: '100%' }} size="large" onChange={handleChangeSelect.bind(null, 'status')}>
                            <Option value="all">全部</Option>
                            <Option value="active">正常</Option>
                            <Option value="pending">审核中</Option>
                            <Option value="paused">暂停</Option>
                        </Select>
                    )}
                </FilterItem>
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }} sm={{ span: 12 }}>
                <FilterItem label="创建时间">
                    {getFieldDecorator('create_time', { initialValue: create_date })(
                        <DatePicker style={{ width: '100%' }}
                            size="large"
                            onChange={handleChangeDate.bind(null, 'create_time')}
                        />,
                    )}
                </FilterItem>
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }} sm={{ span: 12 }}>
                <FilterItem label="结束时间">
                    {getFieldDecorator('end_time', { initialValue: expiration_date })(
                        <DatePicker style={{ width: '100%' }}
                            size="large"
                            onChange={handleChangeDate.bind(null, 'end_time')}
                        />,
                    )}
                </FilterItem>
            </Col>
            <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div>
                        <Button type="primary"
                            size="large"
                            className="margin-right"
                            onClick={handleSubmit}
                        >搜索</Button>
                        <Button size="large" onClick={handleReset}>重置</Button>
                    </div>
                    <div>
                        <Button size="large" type="ghost" onClick={onAdd}>创建</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

Filter.propTypes = {
    onAdd: PropTypes.func,
    form: PropTypes.object,
    filter: PropTypes.object,
    onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
