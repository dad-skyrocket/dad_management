/**
 * SLOT_TYPE
 *
 * @author hyczzhu
 */

const SLOT_TYPE = {
    banner: 'banner',
    native: 'native',
    video: 'video',
}

const SLOT_TYPE_STRING = {
    [SLOT_TYPE.banner]: 'Banner',
    [SLOT_TYPE.native]: 'Native',
    [SLOT_TYPE.video]: 'Video',
}

export const SLOT_TYPE_LIST = Object.keys(SLOT_TYPE).map(t => SLOT_TYPE[t])

export const toString = k => SLOT_TYPE_STRING[k] || 'Unknown'

export default SLOT_TYPE
