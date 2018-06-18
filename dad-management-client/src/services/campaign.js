/**
 * offer
 *
 * @author hyczzhu
 */
import { request, config } from 'utils'

const { api } = config
const { campaigns, campaign } = api

export async function queryList (params) {
    return request({
        url: campaigns,
        method: 'get',
        data: params,
    })
}

export async function query (params) {
    return request({
        url: campaign,
        method: 'get',
        data: params,
    })
}

export async function create (params) {
    return request({
        url: campaign.replace('/:camp_id', ''),
        method: 'post',
        data: params,
    })
}

export async function remove (params) {
    return request({
        url: campaign,
        method: 'delete',
        data: params,
    })
}

export async function update (params) {
    return request({
        url: campaign,
        method: 'put',
        data: params,
    })
}

export async function duplicate (params) {
    return request({
        url: `${campaign}/duplicate`,
        method: 'post',
        data: params,
    })
}
