/**
 * APP_TYPE
 *
 * @author hyczzhu
 */

const APP_TYPE = {
    business: 'business', // 商务应用
    catalogs: 'catalogs', // 目录分类
    education: 'education', // 教育
    entertainment: 'entertainment', // 娱乐
    finance: 'finance', // 财务
    food_drink: 'food_drink', // 食品
    games: 'games', // 游戏
    health_fitness: 'health_fitness', // 健康
    lifestyle: 'lifestyle', // 生活方式
    medical: 'medical', // 医药
    music: 'music', // 音乐
    navigation: 'navigation', // 导航
    news: 'news', // 新闻资讯
    photo_video: 'photo_video', // 照片视频
    productivity: 'productivity', // 效率工具
    reference: 'reference', // 参考
    social_networking: 'social_networking', // 社交
    sports: 'sports', // 运动
    travel: 'travel', // 旅游
    utilities: 'utilities', // 工具
    weather: 'weather', // 天气
    adult: 'adult', // 成人
}

const APP_TYPE_STRING = {
    [APP_TYPE.business]: 'Business', // 商务应用
    [APP_TYPE.catalogs]: 'Catalogs', // 目录分类
    [APP_TYPE.education]: 'Education', // 教育
    [APP_TYPE.entertainment]: 'Entertainment', // 娱乐
    [APP_TYPE.finance]: 'Finance', // 财务
    [APP_TYPE.food_drink]: 'Food & Drink', // 食品
    [APP_TYPE.games]: 'Games', // 游戏
    [APP_TYPE.health_fitness]: 'Health & Fitness', // 健康
    [APP_TYPE.lifestyle]: 'Lifestyle', // 生活方式
    [APP_TYPE.medical]: 'Medical', // 医药
    [APP_TYPE.music]: 'Music', // 音乐
    [APP_TYPE.navigation]: 'Navigation', // 导航
    [APP_TYPE.news]: 'News', // 新闻资讯
    [APP_TYPE.photo_video]: 'Photo & Video', // 照片视频
    [APP_TYPE.productivity]: 'Productivity', // 效率工具
    [APP_TYPE.reference]: 'Reference', // 参考
    [APP_TYPE.social_networking]: 'Social Networking', // 社交
    [APP_TYPE.sports]: 'Sports', // 运动
    [APP_TYPE.travel]: 'Travel', // 旅游
    [APP_TYPE.utilities]: 'Utilities', // 工具
    [APP_TYPE.weather]: 'Weather', // 天气
    [APP_TYPE.adult]: 'Adult', // 成人
}

export const APP_TYPE_LIST = Object.keys(APP_TYPE).map(t => APP_TYPE[t])

export const toString = k => APP_TYPE_STRING[k] || 'Unknown'

export default APP_TYPE
