/**
 * slot
 *
 * @author hyczzhu
 */
import { request, config } from 'utils'

const { api } = config
const { slots } = api

export async function queryList (params) {
    return request({
        url: slots,
        method: 'get',
        data: params,
    })
}
