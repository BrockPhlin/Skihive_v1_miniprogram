// flight-records.js
const app = getApp()
const { storage, STORAGE_KEYS } = require('../../utils/storage.js')

Page({
  data: {
    records: [],
    isAdmin: false,
    isEmpty: true,
    notLoggedIn: false
  },

  onLoad() {
    this.setData({
      isAdmin: app.globalData.isAdmin
    })
    this.loadRecords()
  },

  onShow() {
    this.setData({
      isAdmin: app.globalData.isAdmin
    })
    this.loadRecords()
  },

  loadRecords() {
    // 从 globalData 获取，失败则从 storage 恢复
    let userInfo = app.globalData.userInfo
    if (!userInfo) {
      userInfo = storage.getUserInfo()
      if (userInfo) {
        app.globalData.userInfo = userInfo
        app.globalData.isLoggedIn = true
      }
    }

    // 兼容邮箱登录(email)和微信登录(nickName)
    const userId = userInfo?.email || userInfo?.nickName || ''
    if (!userId) {
      this.setData({
        records: [],
        isEmpty: true,
        notLoggedIn: true
      })
      return
    }

    this.setData({ notLoggedIn: false })

    const isAdmin = app.globalData.isAdmin || (userInfo.isAdmin === true)

    const records = app.getFlightRecords(userId, isAdmin)

    // 格式化时间
    records.forEach(record => {
      const date = new Date(record.timestamp)
      record.formattedTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    })

    this.setData({
      records,
      isEmpty: records.length === 0
    })
  },

  // 删除记录
  deleteRecord(e) {
    const recordId = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条飞行记录吗？',
      success: (res) => {
        if (res.confirm) {
          const records = storage.getFlightRecords()
          const filtered = records.filter(r => r.id !== recordId)
          storage.set(STORAGE_KEYS.FLIGHT_RECORDS, filtered)
          this.loadRecords()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  formatDate(timestamp) {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  navigateBack() {
    wx.navigateBack()
  }
})