// flying.js
const app = getApp()
const { computePersonality } = require('../../../utils/personality')
const EventEngine = require('../../../utils/eventEngine')
const { storage } = require('../../../utils/storage.js')

Page({
  data: {
    isFlying: false,
    flightTime: 0,
    timer: null,
    task: null,
    droneConfig: null,
    stats: null,
    totalScore: null,
    environmentName: '',
    // 事件相关
    eventModalVisible: false,
    currentEvent: null,
    eventIndex: 0,
    totalEvents: 5,
    currentBattery: 100,
    flightSession: {
      events: [],
      accumulatedScore: 0,
      statModifiers: { duration: 0, stability: 0, fun: 0 }
    },
    lastResult: null,  // 存储上一个选择的结果
    isGeneratingEvent: false
  },

  onLoad() {
    try {
      const currentFlight = app.globalData.currentFlight || {}
      const currentTask = app.globalData.currentTask || null
      const environment = app.globalData.environment || {}

      this.setData({
        task: currentTask,
        droneConfig: currentFlight.droneConfig || {},
        stats: currentFlight.stats || { duration: 50, stability: 50, fun: 50 },
        totalScore: typeof currentFlight.totalScore === 'number' ? currentFlight.totalScore : 50,
        environmentName: environment.name || '自由飞行'
      })
      console.log('[flying] onLoad 成功, task:', currentTask?.name, 'drone:', currentFlight.droneConfig?.body)
    } catch (e) {
      console.error('[flying] onLoad 出错:', e)
      // 出错时给最稳的默认值，避免白屏
      this.setData({
        task: null,
        droneConfig: {},
        stats: { duration: 50, stability: 50, fun: 50 },
        totalScore: 50,
        environmentName: '自由飞行'
      })
    }
  },

  onUnload() {
    this.clearTimers()
  },

  clearTimers() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  handleStartFlying: async function() {
    const { stats, droneConfig } = this.data

    // 获取模块选择
    const modules = app.globalData.assemblySelection || []
    const selectedModules = modules.filter(Boolean)

    // 初始化飞行会话
    EventEngine.initFlightSession(stats, selectedModules)

    // 飞行时间
    let flightTime = 0

    this.setData({
      isFlying: true,
      flightTime: 0,
      eventIndex: 0,
      currentBattery: 100,
      flightSession: {
        events: [],
        accumulatedScore: 0,
        statModifiers: { duration: 0, stability: 0, fun: 0 }
      },
      lastResult: null
    })

    // 开始飞行计时
    const timer = setInterval(() => {
      flightTime++
      this.setData({ flightTime })
    }, 1000)

    this.setData({ timer })

    // 显示起点事件（通过AI生成）
    try {
      const startingEvent = await EventEngine.getStartingEvent(this.data.task?.name)
      this.setData({
        currentEvent: startingEvent,
        eventModalVisible: true,
        totalEvents: 6
      })
    } catch (error) {
      console.error('Failed to generate starting event:', error)
      // 使用备用事件
      const fallbackEvent = EventEngine.getFallbackEvent()
      this.setData({
        currentEvent: fallbackEvent,
        eventModalVisible: true,
        totalEvents: 6
      })
    }
  },

  handleStopFlying() {
    this.setData({ isFlying: false })
    this.clearTimers()
  },

  /**
   * 处理事件选择
   */
  async onEventChoice(e) {
    const { choiceId, customText } = e.detail

    const { currentEvent, flightSession, stats, eventIndex } = this.data

    // 处理选择
    const result = EventEngine.processChoice(
      currentEvent,
      choiceId,
      customText,
      stats
    )

    if (!result) {
      this.setData({ eventModalVisible: false })
      return
    }

    // 更新飞行会话
    const events = [...flightSession.events, {
      event: currentEvent,
      choiceId,
      choiceText: result.choiceText,
      customText: result.customText,
      result,
      timepoint: eventIndex + 1
    }]

    const statModifiers = {
      duration: flightSession.statModifiers.duration + result.statEffects.duration,
      stability: flightSession.statModifiers.stability + result.statEffects.stability,
      fun: flightSession.statModifiers.fun + result.statEffects.fun
    }

    const newBattery = result.remainingBattery
    const remainingEvents = result.remainingEvents

    this.setData({
      eventModalVisible: false,
      currentEvent: null,
      eventIndex: eventIndex + 1,
      currentBattery: newBattery,
      'flightSession.events': events,
      'flightSession.accumulatedScore': flightSession.accumulatedScore + result.scoreBonus,
      'flightSession.statModifiers': statModifiers,
      lastResult: result
    })

    // 保存到全局
    app.globalData.currentFlightSession = this.data.flightSession

    // 显示结果提示
    wx.showToast({
      title: result.narration.substring(0, 15),
      icon: 'none',
      duration: 2000
    })

    // 检查是否是最后一个事件（第6个）
    if (eventIndex === 5) {
      // 第6个事件结束，显示结果并结束飞行
      this.clearTimers()
      this.setData({ isFlying: false })

      // 判断成功或失败：电量耗尽提前结束则失败，完成全部6个事件则成功
      const flightSuccess = newBattery > 0

      // 保存结果到全局
      app.globalData.currentFlightSession = this.data.flightSession
      app.globalData.flightSuccess = flightSuccess

      setTimeout(() => {
        wx.showModal({
          title: flightSuccess ? '🎉 任务成功' : '💥 任务失败',
          content: flightSuccess
            ? '恭喜你成功完成了飞行任务！'
            : '任务未能完成...',
          showCancel: false,
          success: () => {
            this.handleFlightEnd()
          }
        })
      }, 1500)
      return
    }

    // 500ms后生成下一个事件
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!this.data.isFlying) return

    this.setData({ isGeneratingEvent: true })

    try {
      // 获取当前多维飞行评分
      const eventScores = EventEngine.getFlightScores()

      const context = {
        task: this.data.task,
        droneConfig: this.data.droneConfig,
        currentBattery: newBattery,
        stats: {
          duration: newBattery,
          stability: Math.max(0, (stats?.stability || 50) + result.statEffects.stability),
          fun: Math.max(0, (stats?.fun || 50) + result.statEffects.fun)
        },
        lastEvent: currentEvent,
        lastChoice: { text: result.choiceText, description: result.choiceText },
        eventScores
      }

      const nextEventIndex = eventIndex + 1
      const isFinalEvent = nextEventIndex === 5

      const nextEvent = await EventEngine.generateNextEvent(context, nextEventIndex, isFinalEvent)

      this.setData({
        currentEvent: nextEvent,
        eventModalVisible: true,
        isGeneratingEvent: false
      })
    } catch (error) {
      console.error('Failed to generate event:', error)
      this.setData({ isGeneratingEvent: false })
      // 使用备用事件
      const fallbackEvent = EventEngine.getFallbackEvent()
      this.setData({
        currentEvent: fallbackEvent,
        eventModalVisible: true
      })
    }
  },

  /**
   * 处理飞行结束
   */
  handleFlightEnd() {
    const { task, droneConfig, stats, totalScore, flightTime, environmentName, flightSession } = this.data

    const userInfo = app.globalData.userInfo || storage.getUserInfo() || {}
    const userId = userInfo.email || userInfo.nickName || 'unknown'
    const userNickname = userInfo.nickname || userInfo.nickName || '未知用户'

    // 计算最终属性
    const finalStats = {
      duration: Math.max(0, (stats?.duration || 0) + flightSession.statModifiers.duration),
      stability: Math.max(0, (stats?.stability || 0) + flightSession.statModifiers.stability),
      fun: Math.max(0, (stats?.fun || 0) + flightSession.statModifiers.fun)
    }

    // 计算最终分数
    const finalScore = (totalScore || 0) + flightSession.accumulatedScore

    // 检查是否因电量耗尽提前结束
    const earlyEnd = this.data.currentBattery <= 0

    // 获取多维飞行评分
    const flightScores = EventEngine.getFlightScores()

    app.globalData.currentFlightSession = flightSession
    app.globalData.finalStats = finalStats
    app.globalData.finalScore = finalScore
    app.globalData.flightEarlyEnd = earlyEnd
    app.globalData.flightScores = flightScores

    const record = app.saveFlightRecord({
      userId,
      userNickname,
      taskName: task?.name || '未知任务',
      droneConfig: droneConfig || {},
      stats: finalStats,
      score: finalScore,
      flightTime,
      environmentName,
      personality: this.computePersonality(finalStats),
      eventCount: flightSession.events.length,
      eventScoreBonus: flightSession.accumulatedScore,
      earlyEnd,
      finalBattery: this.data.currentBattery
    })

    console.log('飞行记录已保存:', record)

    wx.navigateTo({
      url: '/packageA/pages/result/result'
    })
  },

  computePersonality(stats) {
    return computePersonality(stats || this.data.stats, this.data.task?.name)
  },

  /**
   * 处理完成飞行按钮点击
   */
  handleFinishFlight() {
    if (!this.data.isFlying && this.data.flightSession.events.length === 0) {
      // 如果还没开始飞行，提示用户
      wx.showToast({
        title: '请先开始飞行',
        icon: 'none'
      })
      return
    }

    this.clearTimers()
    this.setData({ isFlying: false })

    wx.showModal({
      title: '确认完成飞行',
      content: '确定要结束本次飞行吗？',
      success: (res) => {
        if (res.confirm) {
          this.handleFlightEnd()
        } else {
          // 用户取消，恢复飞行状态
          if (this.data.flightSession.events.length > 0) {
            this.setData({ isFlying: true })
            const timer = setInterval(() => {
              this.setData({ flightTime: this.data.flightTime + 1 })
            }, 1000)
            this.setData({ timer })
          }
        }
      }
    })
  },

  goBack() {
    this.clearTimers()
    wx.navigateBack()
  },

  // 图片加载失败兜底：清空 imageUrl，模板会自动显示 🛸 emoji
  onDroneImageError(e) {
    console.warn('[flying] 飞行器图片加载失败:', this.data.droneConfig.imageUrl, e)
    this.setData({ 'droneConfig.imageUrl': '' })
  },

  // 图片加载成功
  onDroneImageLoad() {
    console.log('[flying] 飞行器图片加载成功')
  }
})