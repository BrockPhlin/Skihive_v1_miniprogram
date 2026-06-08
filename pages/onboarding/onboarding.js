// onboarding.js · 首次启动产品介绍（纯 CSS 海报，无外部图）
const { storage } = require('../../utils/storage.js')

// 4 张介绍页的数据（仅用于底部圆点）
const SLIDES = [
  { id: 1, name: '未来飞行器' },
  { id: 2, name: '场景选择' },
  { id: 3, name: '创作流程' },
  { id: 4, name: '任务选择' }
]

Page({
  data: {
    slides: SLIDES,
    currentIndex: 0
  },

  onLoad() {
    // 不在这里做"已看过"判断，由 app.js / index.js 决定是否跳转进来
  },

  onSwiperChange(e) {
    this.setData({ currentIndex: e.detail.current })
  },

  handleEnter() {
    this._markSeen()
    wx.reLaunch({ url: '/pages/index/index' })
  },

  handleSkip() {
    this._markSeen()
    wx.reLaunch({ url: '/pages/index/index' })
  },

  _markSeen() {
    try {
      wx.setStorageSync('skihive_onboarding_seen', true)
    } catch (e) {
      console.error('[onboarding] 标记已看失败', e)
    }
  }
})
