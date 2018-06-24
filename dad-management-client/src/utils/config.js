const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
    name: 'DAD',
    prefix: 'dad',
    footerText: '',
    logo: '/logo.png',
    iconFontCSS: '/iconfont.css',
    iconFontJS: '/iconfont.js',
    CORS: [],
    openPages: ['/login'],
    apiPrefix: '/api/v1',
    APIV1,
    APIV2,
    api: {
        menus: `${APIV1}/menus`,
        userLogin: `${APIV1}/user/login`,
        userLogout: `${APIV1}/user/logout`,
        userInfo: `${APIV1}/userInfo`,

        applications: `${APIV1}/application`,
        slots: `${APIV1}/slot`,
        slot: `${APIV1}/slot/:slot_id`,
        campaigns: `${APIV1}/campaign`, // 投放列表
        campaign: `${APIV1}/campaign/:camp_id`, // 单个投放
        campaignReport: `${APIV1}/campaign-report`, // 投放报表

        // affiliate: `${APIV1}/affiliate`,
        // advertiser: `${APIV1}/advertiser`,
        // trackingSystem: `${APIV1}/tracking-system`,
        // report: `${APIV1}/report`,

        users: `${APIV1}/users`,
        user: `${APIV1}/user/:id`,
        dashboard: `${APIV1}/dashboard`,
        weather: `${APIV1}/weather`,
        v1test: `${APIV1}/test`,
        v2test: `${APIV2}/test`,
    },
}
