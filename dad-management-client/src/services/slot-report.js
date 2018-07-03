/**
 * slot report
 *
 * @author hyczzhu
 */

import { request, config } from 'utils'

const { api } = config
const { slotReport } = api

export async function queryList (params) {
    return request({
        url: slotReport,
        method: 'get',
        data: params,
    })
}

// const formatPrice = (priceInCent) => {
//     priceInCent = parseInt(priceInCent, 10)
//     return parseFloat((priceInCent / 100).toFixed(2))
// }

export const transformData = (item) => {
    let { impressions, clicks } = item
    impressions = parseInt(impressions, 10)
    clicks = parseInt(clicks, 10)

    return {
        ...item,
        impressions,
        clicks,
        ctr: !isNaN(clicks) && clicks !== 0 ? ((clicks / impressions) * 100).toFixed(2) : 'NA', // eslint-disable-line
    }
}

