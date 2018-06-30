import { request, config } from 'utils'

const { api } = config
const { user, userLogout, userLogin } = api

// Specify different entrance for different roles
export const getDefaultEntrance = (loginUser) => {
    let defaultEntrance = '/login'
    if (loginUser.role === 'admin') {
        defaultEntrance = '/campaign'
    } else if (loginUser.isAdvertiser) {
        defaultEntrance = '/campaign'
    } else if (loginUser.isPublisher) {
        defaultEntrance = '/application'
    } else {
        return null
    }

    return defaultEntrance
}

export async function login (params) {
    return request({
        url: userLogin,
        method: 'post',
        data: params,
    })
}

export async function logout (params) {
    return request({
        url: userLogout,
        method: 'get',
        data: params,
    })
}

export async function query (params) {
    return request({
        url: user.replace('/:id', ''),
        method: 'get',
        data: params,
    })
}
