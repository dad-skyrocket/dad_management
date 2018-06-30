/**
 * publisher
 *
 * @author hyczzhu
 */
import { request, config } from 'utils'

const { api } = config
const { publishers } = api

export async function queryAll (params) {
    return request({
        url: `${publishers}/all`,
        method: 'get',
        data: params,
    })
}
