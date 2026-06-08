// analytics.js
const app = getApp()
const { storage } = require('../../utils/storage.js')

Page({
  data: {
    isEmpty: true,
    notLoggedIn: false,
    // Radar chart data
    radarLabels: ['勇敢', '创意', '稳定', '趣味'],
    personalityData: [0, 0, 0, 0],
    personalityTags: [],
    // Statistics cards
    statCards: [
      { label: '总飞行时长', value: 0, prefix: '', suffix: '分钟', iconClass: 'icon-time' },
      { label: '总飞行次数', value: 0, prefix: '', suffix: '次', iconClass: 'icon-flight' },
      { label: '完成任务数', value: 0, prefix: '', suffix: '个', iconClass: 'icon-task' }
    ],
    // Task completion
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 10,
    // Trend data
    trendData: [],
    // Summary data
    avgFlightTime: 0,
    maxScore: 0,
    avgScore: 0,
    lastFlightTime: '-',
    // Personality distribution
    personalityDistribution: []
  },

  onLoad() {
    this.loadAnalyticsData()
  },

  onShow() {
    this.loadAnalyticsData()
  },

  loadAnalyticsData() {
    // Check login status
    let userInfo = app.globalData.userInfo
    if (!userInfo) {
      userInfo = storage.getUserInfo()
      if (userInfo) {
        app.globalData.userInfo = userInfo
        app.globalData.isLoggedIn = true
      }
    }

    const userId = userInfo?.email || userInfo?.nickName || ''
    if (!userId) {
      this.setData({
        isEmpty: true,
        notLoggedIn: true
      })
      return
    }

    const isAdmin = app.globalData.isAdmin || (userInfo.isAdmin === true)
    const records = app.getFlightRecords(userId, isAdmin)

    if (!records || records.length === 0) {
      this.setData({ isEmpty: true, notLoggedIn: false })
      return
    }

    this.setData({ isEmpty: false, notLoggedIn: false })

    // Calculate statistics
    this.calculateStatistics(records)
  },

  calculateStatistics(records) {
    const totalFlightTime = records.reduce((sum, r) => sum + (r.flightTime || 0), 0)
    const totalFlights = records.length

    // Calculate personality data (average of personality scores)
    let braveSum = 0, creativeSum = 0, stableSum = 0, funSum = 0
    let validPersonalityCount = 0

    records.forEach(record => {
      if (record.personality) {
        braveSum += record.personality.brave || 0
        creativeSum += record.personality.creative || 0
        stableSum += record.personality.stable || 0
        funSum += record.personality.fun || 0
        validPersonalityCount++
      }
    })

    const personalityData = validPersonalityCount > 0
      ? [
          Math.round(braveSum / validPersonalityCount),
          Math.round(creativeSum / validPersonalityCount),
          Math.round(stableSum / validPersonalityCount),
          Math.round(funSum / validPersonalityCount)
        ]
      : [0, 0, 0, 0]

    // Personality tags
    const personalityTags = [
      { name: '勇敢', value: personalityData[0] },
      { name: '创意', value: personalityData[1] },
      { name: '稳定', value: personalityData[2] },
      { name: '趣味', value: personalityData[3] }
    ]

    // Calculate scores
    const scores = records.filter(r => r.score != null).map(r => r.score)
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0
    const avgScore = scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : 0

    // Calculate task completion
    const completedTasks = records.filter(r => r.taskCompleted).length
    const totalTasks = Math.max(records.length, 10) // Use records count or minimum 10
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Calculate average flight time
    const avgFlightTime = totalFlights > 0 ? Math.round(totalFlightTime / totalFlights) : 0

    // Last flight time
    let lastFlightTime = '-'
    if (records.length > 0 && records[0].timestamp) {
      const lastDate = new Date(records[0].timestamp)
      lastFlightTime = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, '0')}-${String(lastDate.getDate()).padStart(2, '0')}`
    }

    // Trend data (mock weekly distribution based on records)
    const trendData = this.calculateTrendData(records)

    // Personality distribution (percentages for each trait)
    const totalPersonality = personalityData.reduce((a, b) => a + b, 0)
    const personalityDistribution = [
      { name: '勇敢', value: totalPersonality > 0 ? Math.round(personalityData[0] / totalPersonality * 100) : 25, color: '#855ee3' },
      { name: '创意', value: totalPersonality > 0 ? Math.round(personalityData[1] / totalPersonality * 100) : 25, color: '#22c55e' },
      { name: '稳定', value: totalPersonality > 0 ? Math.round(personalityData[2] / totalPersonality * 100) : 25, color: '#fdcb6e' },
      { name: '趣味', value: totalPersonality > 0 ? Math.round(personalityData[3] / totalPersonality * 100) : 25, color: '#ef4444' }
    ]

    this.setData({
      statCards: [
        { label: '总飞行时长', value: totalFlightTime, prefix: '', suffix: '分钟', iconClass: 'icon-time' },
        { label: '总飞行次数', value: totalFlights, prefix: '', suffix: '次', iconClass: 'icon-flight' },
        { label: '完成任务数', value: completedTasks, prefix: '', suffix: '个', iconClass: 'icon-task' }
      ],
      personalityData,
      personalityTags,
      completionRate,
      completedTasks,
      totalTasks,
      avgFlightTime,
      maxScore,
      avgScore,
      lastFlightTime,
      trendData,
      personalityDistribution
    })
  },

  calculateTrendData(records) {
    // Group flights by recent days and calculate weekly trend
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const weekAgo = now - 7 * dayMs
    const twoWeeksAgo = now - 14 * dayMs

    let thisWeekTime = 0
    let lastWeekTime = 0

    records.forEach(record => {
      const timestamp = record.timestamp || now
      if (timestamp >= weekAgo) {
        thisWeekTime += record.flightTime || 0
      } else if (timestamp >= twoWeeksAgo) {
        lastWeekTime += record.flightTime || 0
      }
    })

    // Max value for percentage calculation
    const maxTime = Math.max(thisWeekTime, lastWeekTime, 60)

    return [
      { label: '本周', value: thisWeekTime, percentage: Math.round(thisWeekTime / maxTime * 100), color: '#855ee3' },
      { label: '上周', value: lastWeekTime, percentage: Math.round(lastWeekTime / maxTime * 100), color: '#6c4bd4' }
    ]
  },

  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  navigateBack() {
    wx.navigateBack()
  }
})