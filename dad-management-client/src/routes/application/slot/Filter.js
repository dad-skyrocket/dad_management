import React from 'react'
import PropTypes from 'prop-types'
// import { FilterItem } from 'components'
import { Form, Button, Row, Col, /* DatePicker, Input, Select */ } from 'antd'

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

const Filter = ({
    application,
    onAdd,
    // onFilterChange,
    // filter,
    form: {
        // getFieldDecorator,
        // getFieldsValue,
        // setFieldsValue,
    },
}) => {
    return (
        <Row gutter={24}>
            <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '20px', marginLeft: '15px' }}>
                        { application && application.app_name }
                    </div>
                    <div>
                        <Button size="large" type="ghost" onClick={onAdd}>Create</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

Filter.propTypes = {
    application: PropTypes.object,
    onAdd: PropTypes.func,
    form: PropTypes.object,
    filter: PropTypes.object,
    onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
