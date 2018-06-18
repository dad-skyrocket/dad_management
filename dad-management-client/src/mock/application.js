/**
 * application
 *
 * @author hyczzhu
 */
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let applicationData = Mock.mock({
    'data|80-100': [
        {
            app_id: '@id',
            app_type () {
                return Mock.mock({
                    'data|1': [
                        'app_type_0',
                        'app_type_1',
                        'app_type_2',
                    ],
                }).data
            },
            app_name: '@domain',
            app_desc: '@title',
            platform () {
                return Mock.mock({
                    'data|1': [
                        'pc-web',
                        'wap-web',
                        'mobile-app',
                    ],
                }).data
            },
            app_info: {
                web_type () {
                    return Mock.mock({
                        'data|1': [
                            'web_type_0',
                            'web_type_1',
                            'web_type_2',
                        ],
                    }).data
                },
                web_url: '@url',
                pv: '@integer',
                uv: '@integer',

                app_type () {
                    return Mock.mock({
                        'data|1': [
                            'app_type_0',
                            'app_type_1',
                            'app_type_2',
                        ],
                    }).data
                },
                mobile_platform () {
                    return Mock.mock({
                        'data|1': [
                            'mobile_platform_0',
                            'mobile_platform_1',
                            'mobile_platform_2',
                        ],
                    }).data
                },
                package_name: '@title',
                store_url: '@url',
                dau: '@integer',
            },
        },
    ],
})

const database = applicationData.data

// const queryArray = (array, key, keyAlias = 'key') => {
//     if (!(array instanceof Array)) {
//         return null
//     }
//     let data
//
//     for (let item of array) {
//         if (item[keyAlias] === key) {
//             data = item
//             break
//         }
//     }
//
//     if (data) {
//         return data
//     }
//     return null
// }

// const NOTFOUND = {
//     message: 'Not Found',
//     documentation_url: 'http://localhost:8000/request',
// }

module.exports = {

    [`GET ${apiPrefix}/applications`] (req, res) {
        const { query } = req
        let { pageSize, page, ...other } = query
        pageSize = pageSize || 10
        page = page || 1

        let newData = database
        for (let key in other) {
            if ({}.hasOwnProperty.call(other, key)) {
                newData = newData.filter((item) => {
                    if ({}.hasOwnProperty.call(item, key)) {
                        return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
                    }
                    return true
                })
            }
        }

        res.status(200).json({
            data: newData.slice((page - 1) * pageSize, page * pageSize),
            total: newData.length,
        })
    },
}
