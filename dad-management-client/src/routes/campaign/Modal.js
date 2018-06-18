import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Select, DatePicker, Icon, Button, Transfer, Alert, message } from 'antd'
import probe from 'probe-image-size'
import { Upload } from 'components'
import s from './Modal.less'
import initialCountryMap from '../../utils/country'

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
        value: PropTypes.array,
        onChange: PropTypes.func,
    }

    handleChange = (selectedCountryNames = []) => {
        this.props.onChange(selectedCountryNames.map(text => countryReverseMap[text]))
    }

    render () {
        const countryOptions = COUNTRIES.map((c) => {
            // const text = c.text
            return <Option key={c.value} value={c.text}>{ c.text }</Option>
        })

        return (
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择国家"
                onChange={this.handleChange}
                value={(this.props.value || []).map(value => countryMap[value])}
            >
                { countryOptions }
            </Select>
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
                        <div className="ant-upload-text">点击上传</div>
                    </div>
                </Upload>
                <div style={{ marginTop: '5px' }}>
                    <Input style={{ display: 'inline-block', verticalAlign: 'bottom', width: 200, marginRight: 20 }}
                        value={this.state.newUrl}
                        onChange={e => this.setState({ newUrl: e.target.value })}
                    />
                    <Button style={{ verticalAlign: 'bottom' }} onClick={this.addNewUrl}>
                        <Icon type="upload" /> 添加素材链接
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

    render () {
        const { value, onChange, slotList } = this.props
        return (
            <div>
                <TransferWrapper
                    dataSource={slotList.map(slot => ({
                        key: slot.slot_id,
                        title: slot.slot_name,
                    }))}
                    titles={['可选渠道', '已选渠道']}
                    render={_item => _item.title}
                    value={value}
                    onChange={onChange}
                />
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
            data.adv_id = parseInt(data.adv_id, 10)
            data.cost = Math.round(data.cost_value.number * 100)
            data.cost_currency = data.cost_value.currency
            data.cost_value = undefined
            data.revenue = Math.round(data.revenue_value.number * 100)
            data.revenue_currency = data.revenue_value.currency
            data.revenue_vaue = undefined
            data.expiration_date = data.expiration_date_obj.format('X')
            data.platform = Array.isArray(data.platform) ? data.platform : [data.platform]
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
                <div className={s['section-name']}>投放信息</div>
                <FormItem label="投放名称" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('camp_name', {
                        initialValue: item.camp_name,
                        rules: [
                            {
                                required: true,
                                message: '请输入投放名称',
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
                                message: '请输入投放链接',
                            },
                            {
                                type: 'url',
                                message: '请输入url地址',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                {
                    modalType === 'update' &&
                    <FormItem label="投放状态" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('status', {
                            initialValue: item.status || 'pending',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入投放状态',
                                },
                            ],
                        })(
                            <Radio.Group>
                                <RadioButton value="active">正常</RadioButton>
                                <RadioButton value="pending">审核中</RadioButton>
                                <RadioButton value="paused">暂停</RadioButton>
                            </Radio.Group>
                        )}
                    </FormItem>
                }
                <FormItem label="起始时间" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('start_time_obj', {
                        initialValue: item.start_time_obj,
                        rules: [
                            {
                                required: true,
                                message: '请输入起始时间',
                            },
                        ],
                    })(<DatePicker />)}
                </FormItem>
                <FormItem label="结束时间" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('end_time_obj', {
                        initialValue: item.end_time_obj,
                        rules: [
                            {
                                required: true,
                                message: '请输入结束时间',
                            },
                        ],
                    })(<DatePicker />)}
                </FormItem>
                <FormItem label="投放备注" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('offer_desc', {
                        initialValue: item.offer_desc,
                    })(<Input />)}
                </FormItem>

                <div className={s['section-name']}>Payment</div>
                <FormItem label="Payment Method" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('type', {
                        initialValue: item.payment_method || 'cpm',
                        rules: [
                            {
                                required: true,
                                message: '请选择付费类型',
                            },
                        ],
                    })(
                        <Radio.Group>
                            <RadioButton value="cpm">CPM</RadioButton>
                            <RadioButton value="cpc">CPC</RadioButton>
                            <RadioButton value="cpa">CPA</RadioButton>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem label="价格" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('price', {
                        initialValue: item.price || 0,
                        rules: [
                            {
                                required: true,
                                message: '请输入价格',
                            },
                        ],
                    })(<InputNumber
                        min={0}
                        step={1}
                        precision={2}
                    />)}
                </FormItem>

                <div className={s['section-name']}>定向</div>
                <FormItem
                    {...formItemLayout}
                    label="国家"
                >
                    {getFieldDecorator('country', {
                        initialValue: item.country,
                        rules: [
                            {
                                required: true,
                                message: '请选择国家',
                            },
                        ],
                    })(
                        <CountrySelect />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="平台"
                >
                    {getFieldDecorator('platform', {
                        initialValue: Array.isArray(item.platform) ? item.platform[0] : item.platform,
                        rules: [
                            {
                                required: true,
                                message: '请选择平台',
                            },
                        ],
                    })(
                        <Select
                            style={{ width: '100%' }}
                            placeholder="请选择平台"
                        >
                            <Option value="ios">iOS</Option>
                            <Option value="android">Android</Option>
                            <Option value="others">其他</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="广告位"
                >
                    {getFieldDecorator('slots', {
                        initialValue: item.slots || [],
                        rules: [
                            {
                                required: true,
                                message: '请选择广告位',
                            },
                        ],
                    })(
                        <SlotSelector
                            slotList={slotList}
                        />
                    )}
                </FormItem>

                <div className={s['section-name']}>素材</div>
                <FormItem
                    {...formItemLayout}
                    label="素材"
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
