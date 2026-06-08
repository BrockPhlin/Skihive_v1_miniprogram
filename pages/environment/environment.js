// environment.js
const app = getApp()

Page({
  data: {
    environments: [
      { id: 1, name: '航拍出片', icon: '📷', description: '稳定飞行，拍摄风景' },
      { id: 2, name: '室内练习', icon: '🏠', description: '轻量，安全' },
      { id: 3, name: '高速飞行', icon: '⚡', description: '速度与机动性' },
      { id: 4, name: '入门教学', icon: '📖', description: '低成本，低速可飞' }
    ],
    selectedEnvironment: null
  },

  onShow() {
    // 更新导航栏显示用户名
    const userInfo = app.globalData.userInfo
    if (userInfo && userInfo.nickname) {
      wx.setNavigationBarTitle({
        title: userInfo.nickname
      })
    }
  },

  handleEnvironmentSelect(e) {
    const raw = e.currentTarget.dataset.id
    const environmentId = raw === undefined || raw === '' ? null : Number(raw)
    this.setData({
      selectedEnvironment: environmentId
    })
  },

  handleNavigateToAssembly() {
    if (this.data.selectedEnvironment == null) {
      wx.showToast({
        title: '请选择环境',
        icon: 'none'
      })
      return
    }

    // 保存选择的环境
    const env = this.data.environments.find(e => e.id === this.data.selectedEnvironment)
    app.updateEnvironment({ selectedId: this.data.selectedEnvironment, name: env.name, description: env.description })

    wx.navigateTo({
      url: '/packageA/pages/assembly/assembly',
      fail: (err) => {
        wx.showModal({
          title: '无法打开装配页',
          content: (err && err.errMsg) || '请重新编译小程序后重试',
          showCancel: false
        })
      }
    })
  },

  goToFlightRecords() {
    wx.navigateTo({
      url: '/pages/flight-records/flight-records'
    })
  }
})
