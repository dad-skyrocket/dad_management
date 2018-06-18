/**
 * application
 *
 * @author hyczzhu
 */
import { request, config } from 'utils'

const { api } = config
const { applications } = api

export async function queryList (params) {
    return request({
        url: applications,
        method: 'get',
        data: params,
    })
}
