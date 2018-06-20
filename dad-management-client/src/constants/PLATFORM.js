/**
 * PLATFORM
 *
 * @author hyczzhu
 */

const PLATFORM = {
    'pc-web': 'pc-web',
    'wap-web': 'wap-web',
    'mobile-app': 'mobile-app',
}

const PLATFORM_STRING = {
    'pc-web': 'PC Web',
    'wap-web': 'Mobile Wap',
    'mobile-app': 'Mobile App',
}

export const PLATFORM_LIST = Object.keys(PLATFORM).map(t => PLATFORM[t])

export const toString = k => PLATFORM_STRING[k] || 'Unknown'

export default PLATFORM
