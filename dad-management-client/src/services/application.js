/**
 * application
 *
 * @author hyczzhu
 */
import { request, config } from 'utils'

const { api } = config
const { applications, application } = api

export async function queryList (params) {
    return request({
        url: applications,
        method: 'get',
        data: params,
    })
}

export async function query (params) {
    return request({
        url: application,
        method: 'get',
        data: params,
    })
}

export async function create (params) {
    return request({
        url: application.replace('/:app_id', ''),
        method: 'post',
        data: params,
    })
}

export async function remove (params) {
    return request({
        url: application,
        method: 'delete',
        data: params,
    })
}

export async function update (params) {
    return request({
        url: application,
        method: 'put',
        data: params,
    })
}

export async function changeStatus (params) {
    return request({
        url: `${application}/status`,
        method: 'put',
        data: params,
    })
}
