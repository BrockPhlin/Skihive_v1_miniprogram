// 飞行教学页面
const app = getApp()

Page({
  data: {
    // 步骤控制
    currentStep: 0,
    totalSteps: 4,
    progressPercent: 0,
    canProceed: false,

    // 教程步骤数据
    steps: [
      {
        title: '欢迎来到 SKYHIVE',
        subtitle: '一段独特的无人机飞行旅程'
      },
      {
        title: '4 章节剧情模式',
        subtitle: '你的故事，由你选择'
      },
      {
        title: '10 个具名飞行任务',
        subtitle: '每个任务都有专属 AI 故事'
      },
      {
        title: '准备起飞',
        subtitle: '解锁飞手徽章，进入剧情'
      }
    ],

    // 步骤1：飞行器部件
    droneParts: [
      { name: '螺旋桨', desc: '提供飞行动力', icon: '🌀', class: 'propeller-icon' },
      { name: '电池', desc: '提供飞行能量', icon: '🔋', class: 'battery' },
      { name: '摄像头', desc: '拍摄和导航', icon: '📷', class: 'camera' },
      { name: '机身', desc: '主体结构和核心', icon: '💻', class: '' }
    ],

    // 步骤2：飞行模拟
    flightCount: 0,
    successCount: 0,
    flightTime: 0,
    isFlying: false,
    touchActive: false,
    trajectoryPoints: [],
    direction: '',
    directionText: '',
    showAchievement: false,
    earnedBadges: [],

    // 步骤3：装配问答
    quizIndex: 0,
    answerResult: null,
    selectedAnswer: null,
    quizList: [
      {
        question: '电池没电了应该选择哪个模块？',
        options: ['螺旋桨模块', '备用电池', '摄像头模块', '机架模块'],
        correct: 1
      },
      {
        question: '高速飞行应该选择什么配置的螺旋桨？',
        options: ['大尺寸慢速桨', '小尺寸高速桨', '标准桨', '任何桨都可以'],
        correct: 1
      },
      {
        question: '装配时首先要检查哪个部件？',
        options: ['摄像头', '电池', '机身完整性', '螺旋桨颜色'],
        correct: 2
      }
    ],

    // 步骤4：进阶技巧
    tips: [
      {
        id: 1,
        icon: '☀️',
        title: '晴天飞行',
        desc: '保持适当高度，注意强光下航向稳定性',
        weather: 'sunny',
        weatherLabel: '晴天'
      },
      {
        id: 2,
        icon: '🌬️',
        title: '大风环境',
        desc: '降低飞行高度，减小飞行速度，保持平稳操作',
        weather: 'windy',
        weatherLabel: '大风'
      },
      {
        id: 3,
        icon: '🌧️',
        title: '雨天飞行',
        desc: '避免飞行，雨水可能损坏电子设备',
        weather: 'rainy',
        weatherLabel: '雨天'
      },
      {
        id: 4,
        icon: '🌙',
        title: '夜间飞行',
        desc: '开启所有指示灯，保持视线在可控范围内',
        weather: 'sunny',
        weatherLabel: '夜间'
      }
    ],

    // 完成相关
    showCompletion: false,
    allBadges: ['🎓', '🚀', '🔧', '⚡']
  },

  onLoad() {
    // 初始化进度
    this.updateProgress()
    // 引导重设计为纯介绍：所有 4 步都默认可下一步
    this.setData({ canProceed: true })
  },

  onShow() {
    // 重置状态
    this.setData({
      earnedBadges: []
    })
  },

  // 更新进度条
  updateProgress() {
    const percent = ((this.data.currentStep + 1) / this.data.totalSteps) * 100
    this.setData({
      progressPercent: percent
    })
  },

  // 下一步
  handleNextStep() {
    if (!this.data.canProceed) {
      return
    }

    if (this.data.currentStep < this.data.totalSteps - 1) {
      // 进入下一步
      this.setData({
        currentStep: this.data.currentStep + 1,
        canProceed: true
      })

      this.updateProgress()
    } else {
      // 完成教程
      this.showCompletionModal()
    }
  },

  // 飞行模拟相关
  handleTouchStart(e) {
    this.setData({
      touchActive: true
    })
  },

  handleTouchEnd(e) {
    this.setData({
      touchActive: false,
      isFlying: false,
      direction: '',
      directionText: ''
    })
  },

  handleFlyTap(e) {
    const directions = ['up', 'down', 'left', 'right']
    const texts = ['向上飞行', '向下飞行', '向左飞行', '向右飞行']
    const tap = e.detail || e.changedTouches?.[0] || {}

    // 随机选择方向
    const idx = Math.floor(Math.random() * 4)
    const dir = directions[idx]
    const txt = texts[idx]

    // 更新轨迹点
    const x = (Math.random() * 400 + 100).toFixed(0)
    const y = (Math.random() * 200 + 100).toFixed(0)

    const points = [...this.data.trajectoryPoints]
    points.push({ x, y })
    if (points.length > 8) {
      points.shift()
    }

    this.setData({
      isFlying: true,
      direction: dir,
      directionText: txt,
      trajectoryPoints: points,
      flightCount: this.data.flightCount + 1,
      successCount: this.data.successCount + 1
    })

    // 1.5秒后自动停止
    setTimeout(() => {
      this.setData({
        isFlying: false,
        direction: '',
        directionText: ''
      })
    }, 1500)

    // 飞行次数达到5次，解锁徽章
    if (this.data.flightCount + 1 >= 5) {
      setTimeout(() => {
        this.setData({
          showAchievement: true
        })
        this.addBadge('🚀')

        setTimeout(() => {
          this.setData({
            showAchievement: false,
            canProceed: true
          })
        }, 2000)
      }, 500)
    }

    // 更新飞行时间
    const flightTime = this.data.flightTime + 1
    this.setData({
      flightTime: flightTime
    })
  },

  // 问答相关
  handleAnswerSelect(e) {
    const index = e.currentTarget.dataset.index
    const quiz = this.data.quizList[this.data.quizIndex]
    const isCorrect = index === quiz.correct

    this.setData({
      selectedAnswer: index,
      answerResult: isCorrect
    })

    if (isCorrect) {
      // 答对了，增加成功计数
      this.setData({
        successCount: this.data.successCount + 1
      })

      // 延迟进入下一题
      setTimeout(() => {
        if (this.data.quizIndex < this.data.quizList.length - 1) {
          this.setData({
            quizIndex: this.data.quizIndex + 1,
            answerResult: null,
            selectedAnswer: null
          })
        } else {
          // 全部答完
          this.addBadge('🔧')
          this.setData({
            canProceed: true
          })
        }
      }, 1500)
    }
  },

  // 添加徽章
  addBadge(badge) {
    const badges = this.data.earnedBadges
    if (!badges.includes(badge)) {
      badges.push(badge)
      this.setData({
        earnedBadges: badges
      })
    }
  },

  // 显示完成弹窗
  showCompletionModal() {
    // 确保所有徽章都已获得
    const allBadges = ['🎓', '🚀', '🔑', '⚡']
    const earned = this.data.earnedBadges

    // 添加缺失的徽章
    allBadges.forEach(b => {
      if (!earned.includes(b)) {
        earned.push(b)
      }
    })

    this.setData({
      showCompletion: true,
      earnedBadges: earned,
      allBadges: allBadges
    })
  },

  // 进入剧情模式
  handleStartFlight() {
    // 保存教程完成状态
    try {
      const userInfo = app.globalData.userInfo || {}
      userInfo.tutorialCompleted = true
      userInfo.badges = this.data.earnedBadges
      app.globalData.userInfo = userInfo

      wx.setStorageSync('tutorialCompleted', true)
      wx.setStorageSync('userBadges', this.data.earnedBadges)
    } catch (e) {
      console.error('保存教程状态失败', e)
    }

    // 直接跳转到剧情模式（这是项目的核心飞行体验）
    wx.redirectTo({
      url: '/packageA/pages/story/story',
      fail: () => {
        // 兜底：跳回首页
        wx.reLaunch({ url: '/pages/index/index' })
      }
    })
  },

  // 跳过教程（用于测试或快速进入）
  onSkipTutorial() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  },

  navigateBack() {
    wx.navigateBack({
      fail: () => {
        wx.reLaunch({ url: '/pages/index/index' })
      }
    })
  }
})