import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Button, Icon, Menu } from 'antd'

const Divider = () => {
    return <div style={{ borderTop: '1px solid #f4f4f4' }} />
}

const DropOption = ({ onMenuClick, menuOptions = [], buttonStyle, dropdownProps }) => {
    const menu = menuOptions.map((item) => {
        if (item.isDivider) {
            return <Divider key={item.key}/>
        }
        return <Menu.Item key={item.key} disabled={!!item.disabled}>{item.name}</Menu.Item>
    })
    return (<Dropdown
        overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}
        {...dropdownProps}
    >
        <Button style={{ border: 'none', ...buttonStyle }}>
            <Icon style={{ marginRight: 2 }} type="bars" />
            <Icon type="down" />
        </Button>
    </Dropdown>)
}

DropOption.propTypes = {
    onMenuClick: PropTypes.func,
    menuOptions: PropTypes.array.isRequired,
    buttonStyle: PropTypes.object,
    dropdownProps: PropTypes.object,
}

export default DropOption
