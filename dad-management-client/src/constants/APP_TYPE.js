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
    business: 'Business', // 商务应用
    catalogs: 'Catalogs', // 目录分类
    education: 'Education', // 教育
    entertainment: 'Entertainment', // 娱乐
    finance: 'Finance', // 财务
    food_drink: 'Food & Drink', // 食品
    games: 'Games', // 游戏
    health_fitness: 'Health & Fitness', // 健康
    lifestyle: 'Lifestyle', // 生活方式
    medical: 'Medical', // 医药
    music: 'Music', // 音乐
    navigation: 'Navigation', // 导航
    news: 'News', // 新闻资讯
    photo_video: 'Photo & Video', // 照片视频
    productivity: 'Productivity', // 效率工具
    reference: 'Reference', // 参考
    social_networking: 'Social Networking', // 社交
    sports: 'Sports', // 运动
    travel: 'Travel', // 旅游
    utilities: 'Utilities', // 工具
    weather: 'Weather', // 天气
    adult: 'Adult', // 成人
}

export const APP_TYPE_LIST = Object.keys(APP_TYPE).map(t => APP_TYPE[t])

export const toString = k => APP_TYPE_STRING[k] || 'Unknown'

export default APP_TYPE
