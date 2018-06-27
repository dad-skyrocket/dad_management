import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'react-router-dom'
import pathToRegexp from 'path-to-regexp'
import { queryArray } from 'utils'
import styles from './Bread.less'

const Bread = ({ menu, location }) => {
    // 匹配当前路由
    let pathArray = []
    let current;
    // Find current path item
    (menu || []).some((item) => {
        if (item.route && pathToRegexp(item.route).exec(location.pathname)) {
            current = item
            return true
        }
        return false
    })

    const getPathArray = (item) => {
        pathArray.unshift(item) // add to tail
        if (item.bpid) {
            getPathArray(queryArray(menu, item.bpid, 'id'))
        }
    }

    if (!current) {
        pathArray.push({
            id: 404,
            name: 'Not Found',
        })
    } else {
        getPathArray(current)
    }

    // 递归查找父级
    const breads = pathArray.map((item, key) => {
        const content = (
            <span>
                { item.icon ? <Icon type={item.icon} style={{ marginRight: 4 }} /> : ''}
                { item.name }
            </span>
        )
        return (
            <Breadcrumb.Item key={key}>
                {((pathArray.length - 1) !== key)
                    ? <Link to={item.route || '#'}>
                        {content}
                    </Link>
                    : content}
            </Breadcrumb.Item>
        )
    })

    return (
        <div className={styles.bread}>
            <Breadcrumb>
                {breads}
            </Breadcrumb>
        </div>
    )
}

Bread.propTypes = {
    menu: PropTypes.array,
    location: PropTypes.object,
}

export default Bread
