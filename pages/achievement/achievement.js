// achievement.js
const app = getApp()
const { storage } = require('../../utils/storage.js')

// Predefined achievement list
const ACHIEVEMENTS = [
  {
    id: 'first_flight',
    name: '首次飞行',
    description: '完成你的第一次飞行',
    icon: '✈️',
    progress: 1,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'flight_10',
    name: '完成10次飞行',
    description: '累计完成10次飞行',
    icon: '🔟',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'flight_50',
    name: '完成50次飞行',
    description: '累计完成50次飞行',
    icon: '5️⃣',
    progress: 0,
    maxProgress: 50,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'flight_100',
    name: '完成100次飞行',
    description: '累计完成100次飞行',
    icon: '💯',
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'perfect_score',
    name: '满分飞行',
    description: '获得一次满分飞行评价',
    icon: '💎',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'night_owl',
    name: '夜间飞行',
    description: '在夜间完成一次飞行',
    icon: '🦉',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'speed_demon',
    name: '高速飞行',
    description: '达到最高速度限制',
    icon: '⚡',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'collector',
    name: '收集所有模块',
    description: '收集所有飞行模块',
    icon: '📦',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'story_master',
    name: '完成剧情模式',
    description: '通关所有剧情任务',
    icon: '📖',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'lucky_star',
    name: '幸运飞行',
    description: '触发隐藏彩蛋',
    icon: '🌟',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null
  }
]

Page({
  data: {
    achievements: [],
    unlockedCount: 0,
    totalCount: ACHIEVEMENTS.length,
    selectedAchievement: null,
    showUnlockAnimation: false,
    animationAchievementId: null
  },

  onLoad() {
    this.loadAchievements()
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '成就系统'
    })
  },

  loadAchievements() {
    // Load user achievements from storage
    const unlockedIds = storage.getAchievements()
    const flightCount = storage.getFlightRecords().length

    // Update achievements based on user progress
    const achievements = ACHIEVEMENTS.map(achievement => {
      const isUnlocked = unlockedIds.includes(achievement.id)

      // Simulate progress updates based on flight count
      let progress = isUnlocked ? achievement.maxProgress : 0
      if (achievement.id === 'flight_10') progress = Math.min(flightCount, 10)
      if (achievement.id === 'flight_50') progress = Math.min(flightCount, 50)
      if (achievement.id === 'flight_100') progress = Math.min(flightCount, 100)
      if (achievement.id === 'first_flight') progress = flightCount > 0 ? 1 : 0

      return {
        ...achievement,
        progress,
        unlocked: isUnlocked,
        unlockedAt: isUnlocked ? Date.now() : null
      }
    })

    const unlockedCount = achievements.filter(a => a.unlocked).length

    this.setData({
      achievements,
      unlockedCount
    })
  },

  handleAchievementTap(e) {
    const achievement = e.currentTarget.dataset.achievement
    if (!achievement) return

    this.setData({
      selectedAchievement: achievement
    })
  },

  handleShareAchievement(e) {
    const achievement = e.currentTarget.dataset.achievement
    if (!achievement) return

    // If achievement is locked, show hint
    if (!achievement.unlocked) {
      wx.showToast({
        title: '成就未解锁，无法分享',
        icon: 'none'
      })
      return
    }

    // Generate share content
    const shareContent = `我已解锁成就「${achievement.name}」！${achievement.description}`

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    // Custom share message
    wx.updateShareMenu({
      withShareTicket: true,
      isPrivateMessage: false,
      activityId: `achievement_${achievement.id}`,
      success: () => {
        wx.showToast({
          title: '点击右上角分享',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  handleUnlockAnimation(achievementId) {
    this.setData({
      showUnlockAnimation: true,
      animationAchievementId: achievementId
    })

    setTimeout(() => {
      this.setData({
        showUnlockAnimation: false,
        animationAchievementId: null
      })
    }, 2000)
  },

  getProgressPercentage(achievement) {
    if (achievement.maxProgress === 1) {
      return achievement.unlocked ? 100 : 0
    }
    return Math.round((achievement.progress / achievement.maxProgress) * 100)
  },

  formatUnlockedDate(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  },

  navigateBack() {
    wx.navigateBack({
      fail: () => {
        wx.reLaunch({ url: '/pages/index/index' })
      }
    })
  }
})