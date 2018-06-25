import React from 'react'
import PropTypes from 'prop-types'
import {
    Form, Input, InputNumber, Radio, Modal, Select,
    DatePicker, TimePicker, Icon, Button,
    Transfer, Alert, message, Checkbox, Tabs,
} from 'antd'

import probe from 'probe-image-size'
import { Upload } from 'components'
import s from './Modal.less'
import initialCountryMap from '../../utils/country'
import PLATFORM, { PLATFORM_LIST, toString as platformToString } from '../../constants/PLATFORM'

const TabPane = Tabs.TabPane
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

function getUrlExtension (url) {
    return url.split(/\#|\?/)[0].split('.').pop().trim() // eslint-disable-line
}
const isVideo = url => ['.mp3', '.mp4', '.avi', '.mov'].indexOf(`.${getUrlExtension(url || '')}`) >= 0
const isImage = url => [
    '.jpg', '.jpeg', // image/jpeg
    '.png', // image/png, image/x-png
    '.gif', // image/gif
    '.bmp', // image/bmp
    '.wbmp', // image/vnd.wap.wbmp
    '.webp',
    '.tif',
    '.psd',
].indexOf(`.${getUrlExtension(url || '')}`) >= 0

const CREATIVE_TYPE = {
    IMAGE: 'image',
    VIDEO: 'video',
    ICON: 'icon',
    OTHER: 'other',
}

const getUrlType = (url) => {
    let type = CREATIVE_TYPE.OTHER
    if (isVideo(url)) {
        type = CREATIVE_TYPE.VIDEO
    } else if (isImage(url)) {
        type = CREATIVE_TYPE.IMAGE
    }
    return type
}

/* eslint-disable react/no-multi-comp */

class DateTimeSelector extends React.Component { // eslint-disable-line
    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func,
    }

    render () {
        const { value, onChange } = this.props

        return (
            <span>
                <DatePicker value={value} onChange={onChange} />
                <TimePicker
                    value={value}
                    onChange={onChange}
                    format="HH:mm"
                    style={{ marginLeft: '5px' }}
                />
            </span>
        )
    }
}


class PriceInput extends React.Component { // eslint-disable-line
    static propTypes = {
        value: PropTypes.object,
        modalType: PropTypes.string,
        onChange: PropTypes.func,
    }

    componentDidMount () {
        if (!(this.props.value && this.props.value.currency)) {
            this.props.onChange({
                ...this.props.value,
                currency: 'CNY',
            })
        }
    }

    onNumberChange = (number) => {
        this.props.onChange({
            ...this.props.value,
            number,
        })
    }

    onCurrencyChange = (e) => {
        this.props.onChange({
            ...this.props.value,
            currency: e.target.value || 'CNY',
        })
    }

    render () {
        const { value, modalType } = this.props

        return (
            <span>
                <InputNumber
                    min={0}
                    step={1}
                    precision={2}
                    defaultValue={value.number}
                    onChange={this.onNumberChange}
                    // style={{ width: '65%', marginRight: '3%' }}
                />
                <Radio.Group
                    value={value.currency || 'CNY'}
                    onChange={this.onCurrencyChange}
                    // style={{ width: '20%' }}
                    disabled={modalType !== 'create'}
                >
                    <RadioButton value="CNY">¥</RadioButton>
                    <RadioButton value="USD">$</RadioButton>
                </Radio.Group>
                <div style={{ display: 'inline-block', marginLeft: '5px' }}>
                    <Alert message="投放创建后币种将不能更改" type="warning" />
                </div>
            </span>
        )
    }
}

class TransferWrapper extends React.Component {
    static propTypes = {
        value: PropTypes.array,
        onChange: PropTypes.func,
    }

    handleChange = (nextTargetKeys /* , direction, moveKeys */) => {
        this.props.onChange(nextTargetKeys)

        // console.log('targetKeys: ', targetKeys)
        // console.log('direction: ', direction)
        // console.log('moveKeys: ', moveKeys)
    }


    render () {
        const { value, ...others } = this.props
        return (
            <Transfer
                targetKeys={value}
                onChange={this.handleChange}
                {...others}
            />
        )
    }
}

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

class CreativeEditor extends React.Component {
    static propTypes = {
        value: PropTypes.array,
        onChange: PropTypes.func,
    }

    state = {
        newUrl: '',
    }

    onCheck = (file, checked) => {
        const value = (this.props.value || []).map((urlOrFile, idx) => {
            let uid = null
            let f = null
            if (typeof urlOrFile === 'string') {
                uid = urlOrFile
                f = {
                    url: urlOrFile,
                    width: null,
                    height: null,
                    isIcon: false,
                    type: getUrlType(urlOrFile),
                }
            } else if (typeof urlOrFile === 'object') {
                uid = urlOrFile.uid || `${urlOrFile.url}_${idx}`
                f = {
                    url: urlOrFile.url,
                    width: urlOrFile.width,
                    height: urlOrFile.height,
                    isIcon: urlOrFile.isIcon || false,
                    type: urlOrFile.type || getUrlType(urlOrFile.url),
                }
            }
            if (file.uid === uid) {
                return {
                    ...f,
                    isIcon: checked,
                    type: checked ? CREATIVE_TYPE.ICON : getUrlType(f.url),
                }
            }
            return f
        })

        this.props.onChange(value)
    }

    beforeUpload = (file) => {
        const isMp4orMov = file.type === 'video/quicktime' || file.type === 'video/mp4'
        const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'

        if (!isJPGorPNG && !isMp4orMov) {
            message.error('请上传jpeg或png类型图片, mp4或mov类型视频')
            return false
        }

        if (isJPGorPNG) {
            const isLt1M = file.size / 1024 / 1024 <= 1
            if (!isLt1M) {
                message.error('上传图片大小不能超过1MB')
                return false
            }
            return isJPGorPNG && isLt1M
        } else if (isMp4orMov) {
            const isLt20M = file.size / 1024 / 1024 <= 20
            if (!isLt20M) {
                message.error('上传视频大小不能超过20MB')
                return false
            }
            return isMp4orMov && isLt20M
        }

        return false
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewUrl: file.url || file.thumbUrl,
            previewVisible: true,
        })
    }

    handleUpload = (info) => {
        if (info.file.status === 'error') {
            const { error } = info.file

            if (error && error.status === 413) {
                message.error('上传文件过大')
            }
        }

        const fileList = (info.fileList || []).filter(file => file.status && file.status !== 'error')
            .map((file) => {
                if (file.response) {
                    const { url, width, height, isIcon } = file.response || {}
                    file.url = url
                    file.width = width
                    file.height = height
                    file.isIcon = isIcon
                }
                return file
            })
        // console.log(fileList)

        this.props.onChange(fileList)
    }

    addNewUrl = () => {
        if (isVideo(this.state.newUrl)) {
            this.props.onChange((this.props.value || []).concat({
                url: this.state.newUrl,
                isIcon: false,
            }))

            this.setState({
                newUrl: '',
            })
        } else if (isImage(this.state.newUrl)) {
            probe(this.state.newUrl).then((result) => {
                // console.log(result) // =>
                /*
                  {
                    width: xx,
                    height: yy,
                    type: 'jpg',
                    mime: 'image/jpeg',
                    wUnits: 'px',
                    hUnits: 'px',
                    url: 'http://example.com/image.jpg'
                  }
                */
                this.props.onChange((this.props.value || []).concat({
                    url: this.state.newUrl,
                    width: result.width,
                    height: result.height,
                    isIcon: false,
                }))

                this.setState({
                    newUrl: '',
                })
            })
        } else {
            message.error('只能添加视频或图片链接')
        }
    }

    render () {
        // TODO https://ant.design/components/upload-cn/, https://github.com/react-component/upload#customrequest
        // console.log((this.props.value || []).map((urlOrFile, idx) => {
        //     if (typeof urlOrFile === 'string') {
        //         return {
        //             uid: urlOrFile,
        //             status: 'done',
        //             url: urlOrFile,
        //             thumbUrl: urlOrFile,
        //             width: null,
        //             height: null,
        //             isIcon: false,
        //         }
        //     } else if (typeof urlOrFile === 'object') {
        //         return {
        //             uid: urlOrFile.uid || `${urlOrFile.url}_${idx}`,
        //             status: urlOrFile.status || 'done',
        //             url: urlOrFile.url,
        //             thumbUrl: urlOrFile.url,
        //             width: urlOrFile.width,
        //             height: urlOrFile.height,
        //             isIcon: urlOrFile.isIcon || false,
        //         }
        //     }
        //     return null
        // }))

        const { previewUrl } = this.state

        return (
            <div>
                <Upload
                    name="logo"
                    action="/api/v1/upload"
                    listType="picture-card"
                    fileList={(this.props.value || []).map((urlOrFile, idx) => {
                        if (typeof urlOrFile === 'string') {
                            return {
                                uid: urlOrFile,
                                status: 'done',
                                url: urlOrFile,
                                thumbUrl: urlOrFile,
                                width: null,
                                height: null,
                                isIcon: false,
                                type: getUrlType(urlOrFile),
                            }
                        } else if (typeof urlOrFile === 'object') {
                            return {
                                uid: urlOrFile.uid || `${urlOrFile.url}_${idx}`,
                                status: urlOrFile.status || 'done',
                                url: urlOrFile.url,
                                thumbUrl: urlOrFile.url,
                                width: urlOrFile.width,
                                height: urlOrFile.height,
                                isIcon: urlOrFile.type === CREATIVE_TYPE.ICON || urlOrFile.isIcon,
                                type: urlOrFile.isIcon ? CREATIVE_TYPE.ICON : getUrlType(urlOrFile.url),
                                percent: urlOrFile.percent,
                            }
                        }
                        return null
                    })}
                    onPreview={this.handlePreview}
                    onChange={this.handleUpload}
                    onCheck={this.onCheck}
                    beforeUpload={this.beforeUpload}
                >
                    <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                    </div>
                </Upload>
                <div style={{ marginTop: '5px' }}>
                    <Input style={{ display: 'inline-block', verticalAlign: 'bottom', width: 200, marginRight: 20 }}
                        value={this.state.newUrl}
                        onChange={e => this.setState({ newUrl: e.target.value })}
                    />
                    <Button style={{ verticalAlign: 'bottom' }} onClick={this.addNewUrl}>
                        <Icon type="upload" /> Add New Link
                    </Button>
                </div>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    {
                        isVideo(previewUrl) ?
                            <video style={{ width: '100%' }} autoPlay controls src={previewUrl} /> : null // eslint-disable-line
                    }
                    {
                        isImage(previewUrl) ?
                            <img alt="example" style={{ width: '100%' }} src={previewUrl} /> : null
                    }
                </Modal>
            </div>
        )
    }
}

class SlotSelector extends React.Component {
    static propTypes = {
        value: PropTypes.array,
        onChange: PropTypes.func,
        slotList: PropTypes.array,
    }

    constructor (props) {
        super(props)

        this.resetSlotList(props.slotList)

        this.state = {
            activeKey: PLATFORM.PC_WEB,
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.slotList !== this.props.slotList) {
            this.resetSlotList(nextProps.slotList)
        }
    }

    resetSlotList = (slotList = []) => {
        this.platformSlots = {
            [PLATFORM.PC_WEB]: slotList.filter(slot => slot.platform === PLATFORM.PC_WEB),
            [PLATFORM.WAP_WEB]: slotList.filter(slot => slot.platform === PLATFORM.WAP_WEB),
            [PLATFORM.MOBILE_APP]: slotList.filter(slot => slot.platform === PLATFORM.MOBILE_APP),
        }
        this.platformSlotsMap = {
            [PLATFORM.PC_WEB]: this.platformSlots[PLATFORM.PC_WEB].reduce((result, slot) => {
                result[slot.slot_id] = slot
                return result
            }, {}),
            [PLATFORM.WAP_WEB]: this.platformSlots[PLATFORM.WAP_WEB].reduce((result, slot) => {
                result[slot.slot_id] = slot
                return result
            }, {}),
            [PLATFORM.MOBILE_APP]: this.platformSlots[PLATFORM.MOBILE_APP].reduce((result, slot) => {
                result[slot.slot_id] = slot
                return result
            }, {}),
        }
    }

    handleTabClick = (activeKey) => {
        this.setState({
            activeKey,
        })
    }

    handleValueChange = (platform, removeValue = [], addValue = []) => {
        const { value, onChange } = this.props

        const map = (value || []).reduce((result, v) => {
            result[v] = true
            return result
        }, {})

        removeValue.forEach((v) => {
            map[v] = false
        })

        addValue.forEach((v) => {
            map[v] = true
        })

        // console.log(value, removeValue, addValue)

        onChange(Object.keys(map).filter(k => !!map[k]).map(k => parseInt(k, 10)))
    }

    renderTabPane = (platform) => {
        const { value } = this.props

        // console.log(value, this.platformSlots[platform])

        const tabValue = (value || []).filter((slotId) => {
            return this.platformSlotsMap[platform][slotId]
        })

        const title = <span>{ platformToString(platform) }</span>

        return (
            <TabPane tab={title} key={platform}>
                <TransferWrapper
                    dataSource={this.platformSlots[platform].map(slot => ({
                        key: slot.slot_id,
                        title: slot.slot_name,
                    }))}
                    titles={['Available Slots', 'Selected Slots']}
                    render={_item => _item.title}
                    value={tabValue}
                    onChange={v => this.handleValueChange(platform, tabValue, v)}
                />
            </TabPane>
        )
    }

    render () {
        return (
            <div>
                <Tabs activeKey={this.state.activeKey || PLATFORM.PC_WEB} onTabClick={this.handleTabClick}>
                    { PLATFORM_LIST.map(platform => this.renderTabPane(platform))}
                </Tabs>

            </div>
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
        getFieldValue,
        setFieldsValue,
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
            data.price = Math.round(data.priceInDollar * 100)
            data.start_time = data.start_time_obj.format('X')
            data.end_time = data.end_time_obj.format('X')
            data.country = data.country_obj.all ? [] : data.country_obj.country
            data.creative = (data.creative || []).map((urlOrFile) => {
                if (typeof urlOrFile === 'string') {
                    return {
                        url: urlOrFile,
                        type: getUrlType(urlOrFile),
                    }
                } else if (typeof urlOrFile === 'object') {
                    if (urlOrFile.type === 'ICON') { // data fix
                        urlOrFile.type = CREATIVE_TYPE.ICON
                    }
                    return {
                        url: urlOrFile.url,
                        width: urlOrFile.width,
                        height: urlOrFile.height,
                        // isIcon: urlOrFile.isIcon || false,
                        type: (urlOrFile.type !== CREATIVE_TYPE.OTHER && urlOrFile.type) // if type is resolved, use it
                            || (urlOrFile.isIcon ? CREATIVE_TYPE.ICON : getUrlType(urlOrFile.url)), // otherwise, parse again
                    }
                }

                return null
            }).map((creativeObj) => {
                if (creativeObj) {
                    return JSON.stringify(creativeObj)
                }
                return null
            })
            // console.log(data)
            onOk(data)
        })
    }

    const modalOpts = {
        ...modalProps,
        onOk: handleOk,
    }

    const onPriceChange = (key, value) => { // eslint-disable-line
        const costValue = getFieldValue('cost_value')
        const revenueValue = getFieldValue('revenue_value')

        setFieldsValue({
            cost_value: {
                ...costValue,
                currency: value.currency,
            },
            revenue_value: {
                ...revenueValue,
                currency: value.currency,
            },
            [key]: value,
        })
    }

    return (
        <Modal width={760} {...modalOpts}>
            <Form layout="horizontal">
                <div className={s['section-name']}>Basic</div>
                <FormItem label="Campaign Name" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('camp_name', {
                        initialValue: item.camp_name,
                        rules: [
                            {
                                required: true,
                                message: 'Please input campaign name',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Campaign Link" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('camp_url', {
                        initialValue: item.camp_url,
                        rules: [
                            {
                                required: true,
                                message: 'Please input campaign link',
                            },
                            {
                                type: 'url',
                                message: 'campaign link must be a valid url',
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
                <FormItem label="Start Time" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('start_time_obj', {
                        initialValue: item.start_time_obj,
                        rules: [
                            {
                                required: true,
                                message: 'Please choose start time',
                            },
                        ],
                    })(<DateTimeSelector />)}
                </FormItem>
                <FormItem label="End Time" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('end_time_obj', {
                        initialValue: item.end_time_obj,
                        rules: [
                            {
                                required: true,
                                message: 'Please choose end time',
                            },
                        ],
                    })(<DateTimeSelector />)}
                </FormItem>
                <FormItem label="Description" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('app_desc', {
                        initialValue: item.app_desc,
                    })(<Input />)}
                </FormItem>

                <div className={s['section-name']}>Payment</div>
                <FormItem label="Payment Method" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('payment_method', {
                        initialValue: item.payment_method || 'CPM',
                        rules: [
                            {
                                required: true,
                                message: 'Please choose payment method',
                            },
                        ],
                    })(
                        <Radio.Group>
                            <RadioButton value="CPM">CPM</RadioButton>
                            <RadioButton value="CPC">CPC</RadioButton>
                            <RadioButton value="CPA">CPA</RadioButton>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem label="Price" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('priceInDollar', {
                        initialValue: item.priceInDollar || 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input price',
                            },
                        ],
                    })(<InputNumber
                        min={0}
                        step={1}
                        precision={2}
                    />)}
                </FormItem>

                <div className={s['section-name']}>Targeting</div>
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
                <FormItem
                    {...formItemLayout}
                    label="Slots"
                >
                    {getFieldDecorator('slot_ids', {
                        initialValue: item.slot_ids || [],
                        rules: [
                            {
                                required: true,
                                message: 'Please choose slots',
                            },
                        ],
                    })(
                        <SlotSelector
                            slotList={slotList}
                        />
                    )}
                </FormItem>

                <div className={s['section-name']}>Creative</div>
                <FormItem
                    {...formItemLayout}
                    label="Creative"
                >
                    {getFieldDecorator('creative', {
                        initialValue: item.creative || [],
                    })(
                        <CreativeEditor />
                    )}
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
