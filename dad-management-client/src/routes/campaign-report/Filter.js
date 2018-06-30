import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Select, Message } from 'antd'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import moment from 'moment'
import { request, config } from 'utils'
import { transformData } from 'services/campaign-report'
import { PLATFORM_LIST, toString as platformToString } from '../../constants/PLATFORM'

const { RangePicker } = DatePicker
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

const timezones = [-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((v) => {
    const vStr = v >= 0 ? `+${v}` : `${v}`
    return { name: Math.abs(v) < 10 ? `UTC${vStr[0]}0${vStr[1]}:00` : `UTC${v}:00`, value: v }
})

/* eslint-disable camelcase */

/* see Browser download file example in docs */
function s2ab (s/* :string */)/* :ArrayBuffer */ {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; i += 1) view[i] = s.charCodeAt(i) & 0xFF // eslint-disable-line
    return buf
}

const Filter = ({
    isAdmin,
    advList,
    onFilterChange,
    filter,
    form: {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
    },
}) => {
    const formatDateRange = (fields) => {
        const { date_range, timezone } = fields
        if (date_range) {
            fields.start_date = date_range[0] ? date_range[0].format('YYYY-MM-DD') : undefined
            fields.end_date = date_range[1] ? date_range[1].format('YYYY-MM-DD') : undefined
            fields.date_range = undefined
            fields.timezone = parseInt(timezone, 10)
        }
    }

    const handleSubmit = () => {
        let fields = getFieldsValue()
        formatDateRange(fields)
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
        fields.date_range = [moment(), moment()]
        fields.timezone = '8'
        setFieldsValue(fields)
        handleSubmit()
    }

    const handleChangeDateRange = (key, values) => {
        let fields = getFieldsValue()

        // force the range less than 1 month
        if (values[1].isAfter(moment(values[0]).endOf('day').add(30, 'days'))) {
            values[1] = moment(values[0]).endOf('day').add(30, 'days')
            Message.warn(`Date range cannot exceed 31 days, the end time is reset to ${values[1].format('YYYY-MM-DD')}`)
        }

        fields[key] = values
        formatDateRange(fields)
        onFilterChange(fields)
    }

    const handleChangeSelect = (key, values) => {
        let fields = getFieldsValue()
        fields[key] = values
        formatDateRange(fields)
        onFilterChange(fields)
    }

    function exportFile (data) {
        /* convert state to workbook */
        const ws = XLSX.utils.aoa_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'campaign_report')
        /* generate XLSX file */
        const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' })
        /* send to client */
        FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'campaign_report.xlsx') // eslint-disable-line
    }

    const handleExport = async () => {
        let fields = getFieldsValue()
        formatDateRange(fields)

        request({
            method: 'get',
            data: fields,
            url: config.api.campaignReport,
        }).then((res) => {
            const data = [[
                'Date',
                'Campaign Id',
                'Campaign Name',
                'Platform',
                'Impression',
                'Clicks',
                'CTR',
            ]].concat((res.data || []).map(record => transformData(record)).map(record => ([
                record.date,
                record.camp_id,
                record.camp_name,
                platformToString(record.platform) || 'Unknown platform',
                record.impression,
                record.clicks,
                `${record.ctr} %`,
            ])))
            exportFile(data)
        })
    }

    function disabledDate (current) {
        // Can not select days 3 months ago
        return current && current.valueOf() < (Date.now() - 3600000 * 24 * 31 * 3) // eslint-disable-line
    }

    const { camp_id, camp_name, platform, date_range, timezone, adv_id } = filter

    return (
        <Row gutter={24}>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                {getFieldDecorator('camp_id', { initialValue: camp_id })(<Search placeholder="Search by campaign id"
                    size="large"
                    onSearch={handleSubmit}
                />)}
            </Col>
            {
                /*
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                {getFieldDecorator('camp_name', { initialValue: camp_name })(<Search placeholder="搜索订单名"
                    size="large"
                    onSearch={handleSubmit}
                />)}
            </Col>
            */
            }
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                <FilterItem label="Platform">
                    {getFieldDecorator('platform', { initialValue: platform || 'all' })(
                        <Select style={{ width: '100%' }} size="large" onChange={handleChangeSelect.bind(null, 'platform')}>
                            <Option value="all">All</Option>
                            {
                                PLATFORM_LIST.map(k => (
                                    <Option key={k} value={k}>
                                        { platformToString(k) }
                                    </Option>
                                ))
                            }
                        </Select>
                    )}
                </FilterItem>
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }} sm={{ span: 12 }}>
                <FilterItem label="Date">
                    {getFieldDecorator('date_range', { initialValue: date_range || [moment(), moment()] })(
                        <RangePicker style={{ width: '100%' }}
                            size="large"
                            onChange={handleChangeDateRange.bind(null, 'date_range')}
                            disabledDate={disabledDate}
                            ranges={{
                                'Today': [moment().startOf('day'), moment().endOf('day')],
                                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                                'Recent last 7 days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                            }}
                        />,
                    )}
                </FilterItem>
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                <FilterItem label="Time zone">
                    {getFieldDecorator('timezone', { initialValue: timezone || '8' })(
                        <Select style={{ width: '100%' }} size="large" onChange={handleChangeSelect.bind(null, 'timezone')}>
                            {
                                (timezones || []).map(tz => (
                                    <Option key={tz.value} value={`${tz.value}`}>
                                        { tz.name }
                                    </Option>
                                ))
                            }
                        </Select>
                    )}
                </FilterItem>
            </Col>
            {
                isAdmin ?
                    <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }} sm={{ span: 12 }}>
                        <FilterItem label="Advertisers">
                            {getFieldDecorator('adv_id', { initialValue: adv_id || 'all' })(
                                <Select style={{ width: '100%' }} size="large" onChange={handleChangeSelect.bind(null, 'adv_id')}>
                                    <Option value="all">All</Option>
                                    {
                                        (advList || []).map(adv => <Option key={adv.adv_id} value={`${adv.adv_id}`}>{adv.adv_name}</Option>)
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
                    <div>
                        <Button size="large" type="ghost" onClick={handleExport}>Export as excel</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

Filter.propTypes = {
    isAdmin: PropTypes.bool,
    advList: PropTypes.array,
    onAdd: PropTypes.func,
    form: PropTypes.object,
    filter: PropTypes.object,
    onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
