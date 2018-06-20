/**
 * PLATFORM
 *
 * @author hyczzhu
 */
const PLATFORM = {
    PC_WEB: 'pc-web',
    WAP_WEB: 'wap-web',
    MOBILE_APP: 'mobile-app',
}

const PLATFORM_STRING = {
    [PLATFORM.PC_WEB]: 'PC Web',
    [PLATFORM.WAP_WEB]: 'Mobile Wap',
    [PLATFORM.MOBILE_APP]: 'Mobile App',
}

export const PLATFORM_LIST = Object.keys(PLATFORM).map(t => PLATFORM[t])

export const toString = v => PLATFORM_STRING[v] || 'Unknown'

export default PLATFORM
