// index.js
const app = getApp()
const { storage } = require('../../utils/storage')

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    flightCount: 0,
    totalFlights: '0分钟',
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const isLoggedIn = app.globalData.isLoggedIn
    const userInfo = app.globalData.userInfo

    // 获取飞行统计
    let flightCount = 0
    let totalMinutes = 0

    if (isLoggedIn) {
      const records = storage.getFlightRecords()
      const userIdKey = userInfo?.email || userInfo?.nickName || ''
      const userRecords = app.globalData.isAdmin
        ? records
        : records.filter(r => r.userId === userIdKey)

      flightCount = userRecords.length
      totalMinutes = userRecords.reduce((sum, r) => sum + (r.flightTime || 0), 0)
    }

    this.setData({
      isLoggedIn,
      userInfo,
      flightCount,
      totalFlights: totalMinutes > 0 ? `${totalMinutes}分钟` : '0分钟',
    })
  },

  handleStartTask() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/task-card/task-card'
    })
  },

  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  handleRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  handleFlightRecords() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/flight-records/flight-records'
    })
  },

  handleAnalytics() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/analytics/analytics'
    })
  },

  handleAchievement() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/achievement/achievement'
    })
  },

  handleShop() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/shop/shop'
    })
  },

  handleTutorial() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/tutorial/tutorial'
    })
  },

  handleStoryMode() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageA/pages/story/story'
    })
  },

  handleLogout() {
    app.logout()
    this.checkLoginStatus()
    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    })
  }
})