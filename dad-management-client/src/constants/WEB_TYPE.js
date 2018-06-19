/**
 * WEB_TYPE
 *
 * @author hyczzhu
 */

const WEB_TYPE = {
    forum: 'forum', // 论坛
    news: 'news', // 新闻资讯
    exchange: 'exchange', // 交易所
    personal: 'personal', // 个人站
}

const WEB_TYPE_STRING = {
    forum: 'Forum', // 论坛
    news: 'News', // 新闻资讯
    exchange: 'Exchange', // 交易所
    personal: 'Personal', // 个人站
}

export const WEB_TYPE_LIST = Object.keys(WEB_TYPE).map(t => WEB_TYPE[t])

export const toString = k => WEB_TYPE_STRING[k] || 'Unknown'

export default WEB_TYPE
