/**
 * advertiser
 *
 * @author hyczzhu
 */
import { request, config } from 'utils'

const { api } = config
const { advertisers } = api

export async function queryAll (params) {
    return request({
        url: `${advertisers}/all`,
        method: 'get',
        data: params,
    })
}
