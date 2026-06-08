// shop.js
const app = getApp()
const { storage } = require('../../utils/storage.js')

// 装备数据
const equipmentData = {
  modules: [
    { id: 'm1', name: '大电池', desc: '容量提升50%，飞行时间更长', price: 200, rarity: 'common', category: 'modules', cover: '' },
    { id: 'm2', name: '夜拍相机', desc: '暗光环境也能清晰拍摄', price: 300, rarity: 'epic', category: 'modules', cover: '' },
    { id: 'm3', name: '云台稳定器', desc: '画面超级稳定，防抖神器', price: 350, rarity: 'epic', category: 'modules', cover: '' },
    { id: 'm4', name: '探照灯', desc: '夜间飞行也能看清前方', price: 150, rarity: 'common', category: 'modules', cover: '' }
  ],
  bodies: [
    { id: 'b1', name: 'Air Lite', desc: '轻量化设计，飞行更灵活', price: 500, rarity: 'common', category: 'bodies', cover: '' },
    { id: 'b2', name: 'Speed Bee', desc: '速度提升80%，竞速首选', price: 800, rarity: 'legendary', category: 'bodies', cover: '' },
    { id: 'b3', name: 'Stable Pro', desc: '稳定性极佳，新手友好', price: 600, rarity: 'epic', category: 'bodies', cover: '' }
  ],
  shells: [
    { id: 's1', name: '圆润治愈壳', desc: '可爱圆润造型，触感舒适', price: 200, rarity: 'common', category: 'shells', cover: '' },
    { id: 's2', name: '流线速度壳', desc: '空气动力学设计，极速体验', price: 300, rarity: 'epic', category: 'shells', cover: '' },
    { id: 's3', name: '城市科技壳', desc: '赛博朋克风格，科技感十足', price: 250, rarity: 'common', category: 'shells', cover: '' }
  ]
}

Page({
  data: {
    userCoins: 1000,
    canClaimDaily: true,
    selectedCategory: 'modules',
    categories: [
      { id: 'modules', name: '模块', icon: '🔌' },
      { id: 'bodies', name: '机身', icon: '🚁' },
      { id: 'shells', name: '外壳', icon: '🎨' },
      { id: 'colors', name: '配色', icon: '🌈' },
      { id: 'accessories', name: '点缀件', icon: '✨' }
    ],
    filteredEquipments: [],
    isGachaSpinning: false,
    ownedCount: 0,
    ownedItems: []
  },

  onLoad() {
    this.loadUserData()
    this.updateFilteredEquipments()
    this.checkDailyReward()
  },

  onShow() {
    this.loadUserData()
    this.updateFilteredEquipments()
  },

  loadUserData() {
    // 从全局数据获取用户金币和拥有物品
    const userInfo = app.globalData.userInfo || {}
    this.setData({
      userCoins: storage.getCurrency(),
      ownedItems: userInfo.ownedItems || [],
      ownedCount: (userInfo.ownedItems || []).length
    })
  },

  updateFilteredEquipments() {
    const category = this.data.selectedCategory
    let items = equipmentData[category] || []

    // 添加拥有状态
    items = items.map(item => ({
      ...item,
      owned: this.data.ownedItems.includes(item.id)
    }))

    this.setData({ filteredEquipments: items })
  },

  checkDailyReward() {
    // 检查是否已领取每日奖励
    const rewards = storage.getDailyRewards()
    const today = new Date().toDateString()
    this.setData({
      canClaimDaily: rewards.lastClaimDate !== today
    })
  },

  handleSelectCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({ selectedCategory: categoryId })
    this.updateFilteredEquipments()
  },

  handleBuy(e) {
    const itemId = e.currentTarget.dataset.id
    const item = this.findItemById(itemId)

    if (!item) return

    if (this.data.userCoins < item.price) {
      wx.showToast({
        title: '金币不足',
        icon: 'none'
      })
      return
    }

    if (this.data.ownedItems.includes(item.id)) {
      wx.showToast({
        title: '已拥有该装备',
        icon: 'none'
      })
      return
    }

    // 扣除金币并添加装备
    storage.deductCurrency(item.price)
    const newCoins = storage.getCurrency()
    const newOwnedItems = [...this.data.ownedItems, itemId]

    // 更新全局数据
    if (app.globalData.userInfo) {
      app.globalData.userInfo.ownedItems = newOwnedItems
    }

    this.setData({
      userCoins: newCoins,
      ownedItems: newOwnedItems,
      ownedCount: newOwnedItems.length
    })

    this.updateFilteredEquipments()

    wx.showToast({
      title: '购买成功',
      icon: 'success'
    })
  },

  findItemById(itemId) {
    for (const category in equipmentData) {
      const item = equipmentData[category].find(i => i.id === itemId)
      if (item) return item
    }
    return null
  },

  handleClaimDaily() {
    if (!this.data.canClaimDaily) {
      wx.showToast({
        title: '今日已领取',
        icon: 'none'
      })
      return
    }

    const result = storage.claimDailyReward()
    if (!result.success) {
      wx.showToast({
        title: result.message || '今日已领取',
        icon: 'none'
      })
      return
    }

    if (app.globalData.userInfo) {
      app.globalData.userInfo.coins = storage.getCurrency()
    }

    this.setData({
      userCoins: storage.getCurrency(),
      canClaimDaily: false
    })

    wx.showToast({
      title: '获得 ' + result.reward + ' 金币',
      icon: 'success'
    })
  },

  handleGacha() {
    if (this.data.isGachaSpinning) return

    if (this.data.userCoins < 100) {
      wx.showToast({
        title: '金币不足',
        icon: 'none'
      })
      return
    }

    this.setData({ isGachaSpinning: true })

    // 扣除金币
    storage.deductCurrency(100)
    const currentCoins = storage.getCurrency()

    if (app.globalData.userInfo) {
      app.globalData.userInfo.coins = currentCoins
    }
    this.setData({ userCoins: currentCoins })

    // 模拟扭蛋动画
    setTimeout(() => {
      // 随机获取装备
      const allItems = Object.values(equipmentData).flat()
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)]

      // 检查是否已拥有
      let message = ''
      if (this.data.ownedItems.includes(randomItem.id)) {
        // 退还金币
        storage.addCurrency(50)
        const refundCoins = storage.getCurrency()
        if (app.globalData.userInfo) {
          app.globalData.userInfo.coins = refundCoins
        }
        this.setData({ userCoins: refundCoins })
        message = '重复装备，返还50金币'
      } else {
        // 添加装备
        const newOwnedItems = [...this.data.ownedItems, randomItem.id]
        if (app.globalData.userInfo) {
          app.globalData.userInfo.ownedItems = newOwnedItems
        }
        this.setData({
          ownedItems: newOwnedItems,
          ownedCount: newOwnedItems.length
        })
        this.updateFilteredEquipments()
        message = '获得 ' + randomItem.name
      }

      this.setData({ isGachaSpinning: false })

      wx.showModal({
        title: '扭蛋结果',
        content: message,
        showCancel: false
      })
    }, 2000)
  },

  handleShowInventory() {
    const ownedIds = this.data.ownedItems
    if (!ownedIds || ownedIds.length === 0) {
      wx.showModal({
        title: '库存',
        content: '你还没有任何装备。\n去上方分类选购，或试试每日扭蛋 🎁',
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    // 收集已拥有装备的详细信息
    const allItems = Object.values(equipmentData).flat()
    const lines = ownedIds.map((id, idx) => {
      const item = allItems.find(i => i.id === id)
      if (!item) return `${idx + 1}. [未知装备 ${id}]`
      const rarity = item.rarity === 'legendary' ? '传说' : item.rarity === 'epic' ? '史诗' : '普通'
      return `${idx + 1}. ${item.name}  [${rarity}]  🪙 ${item.price}`
    })

    const content = `已拥有 ${ownedIds.length} 件装备：\n\n${lines.join('\n')}`

    wx.showModal({
      title: '📦 我的库存',
      content,
      showCancel: true,
      cancelText: '关闭',
      confirmText: '继续购买'
    })
  }
})