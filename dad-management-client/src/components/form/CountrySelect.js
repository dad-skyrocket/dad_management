/**
 * CountrySelect
 *
 * @author hyczzhu
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Select, Checkbox } from 'antd'

import initialCountryMap from '../../utils/country'

const Option = Select.Option

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

export default class CountrySelect extends React.Component {
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
