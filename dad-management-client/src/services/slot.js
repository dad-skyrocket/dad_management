/**
 * slot
 *
 * @author hyczzhu
 */
import { request, config } from 'utils'

const { api } = config
const { slots, slot } = api

export async function queryAll (params) {
    return request({
        url: `${slots}/all`,
        method: 'get',
        data: params,
    })
}

export async function queryList (params) {
    return request({
        url: slots,
        method: 'get',
        data: params,
    })
}

export async function query (params) {
    return request({
        url: slot,
        method: 'get',
        data: params,
    })
}

export async function create (params) {
    return request({
        url: slot.replace('/:slot_id', ''),
        method: 'post',
        data: params,
    })
}

export async function remove (params) {
    return request({
        url: slot,
        method: 'delete',
        data: params,
    })
}

export async function update (params) {
    return request({
        url: slot,
        method: 'put',
        data: params,
    })
}

export async function duplicate (params) {
    return request({
        url: `${slot}/duplicate`,
        method: 'post',
        data: params,
    })
}

export async function changeStatus (params) {
    return request({
        url: `${slot}/status`,
        method: 'put',
        data: params,
    })
}

