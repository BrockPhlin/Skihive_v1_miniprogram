// result.js
const app = getApp()
const { computePersonality, computeFlightPersonality, formatFlightPersonalityDisplay, getScoreDimensions } = require('../../../utils/personality')

// twist词库
const TWISTS = [
  '被海鸥误认为同类一路伴飞',
  '意外闯入毕业生合照C位',
  '让路人误以为学校上新黑科技',
  '把普通任务拍成了MV预告片',
  '吸引一只猫决定跟着返航',
  '顺手拍到一张神级头像图',
  '被围观同学追问在哪里买'
]

// bonus词库
const BONUSES = [
  '一条爆款10秒短视频',
  '一位潜在社群新飞手',
  '一张朋友圈封面神图',
  '一段意外浪漫时刻',
  '一个属于你的飞行名场面'
]

// 提前结束原因
const EARLY_END_REASONS = [
  '电量耗尽，紧急降落',
  '遇到意外状况，被迫返航',
  '突发故障，执行紧急降落'
]

// DeepSeek API 配置
const DEEPSEEK_CONFIG = {
  baseURL: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  apiKey: 'sk-b209dca5ace54be9b29668609e2f1e95'
}

Page({
  data: {
    task: null,
    droneConfig: {},
    stats: {},
    totalScore: 0,
    personality: '',
    personalityDesc: '',
    twist: '',
    bonus: '',
    storyText: '',
    // 事件相关
    eventStory: '',
    eventCount: 0,
    eventScoreBonus: 0,
    events: [],
    // 提前结束标记
    earlyEnd: false,
    earlyEndReason: '',
    finalBattery: 0,
    // 多维飞行评分
    flightScores: null,
    flightPersonality: null,
    flightPersonalityDisplay: null,
    isGeneratingStory: false
  },

  onLoad() {
    const currentFlight = app.globalData.currentFlight
    const currentTask = app.globalData.currentTask
    const flightSession = app.globalData.currentFlightSession || {}
    const finalStats = app.globalData.finalStats || currentFlight?.stats
    const finalScore = app.globalData.finalScore || currentFlight?.totalScore
    const flightScores = app.globalData.flightScores || null

    const earlyEnd = app.globalData.flightEarlyEnd || false
    const finalBattery = finalStats?.duration || 0
    const flightSuccess = app.globalData.flightSuccess

    const twist = TWISTS[Math.floor(Math.random() * TWISTS.length)]
    const bonus = BONUSES[Math.floor(Math.random() * BONUSES.length)]

    // 计算基础人格
    const personality = computePersonality(finalStats, currentTask?.name)

    // 计算多维飞行人格
    let flightPersonality = null
    let flightPersonalityDisplay = null
    if (flightScores) {
      flightPersonality = computeFlightPersonality(flightScores)
      if (flightPersonality) {
        flightPersonalityDisplay = formatFlightPersonalityDisplay(flightPersonality)
      }
    }

    // 生成事件故事
    const eventStory = this.generateEventStory(flightSession.events || [], earlyEnd)
    const eventCount = flightSession.events?.length || 0
    const eventScoreBonus = flightSession.accumulatedScore || 0

    // 提前结束原因
    let earlyEndReason = ''
    if (earlyEnd) {
      earlyEndReason = EARLY_END_REASONS[Math.floor(Math.random() * EARLY_END_REASONS.length)]
    }

    // 先生成静态故事，后续会调用AI生成更丰富的故事
    const storyText = this.generateBaseStory(currentTask, currentFlight, twist, bonus, eventCount, earlyEnd, earlyEndReason)

    this.setData({
      task: currentTask,
      droneConfig: currentFlight?.droneConfig || {},
      stats: finalStats || {},
      totalScore: finalScore || 0,
      personality,
      personalityDesc: this.getPersonalityDescription(personality),
      twist,
      bonus,
      storyText,
      eventStory,
      eventCount,
      eventScoreBonus,
      events: flightSession.events || [],
      earlyEnd,
      earlyEndReason,
      finalBattery,
      flightScores,
      flightPersonality,
      flightPersonalityDisplay,
      flightSuccess
    })

    // 调用AI生成更丰富的故事
    this.generateAIStory(flightSession.events || [], currentTask, currentFlight, earlyEnd, earlyEndReason)
  },

  getPersonalityDescription(personality) {
    const descriptions = {
      '追光狂 LIGHT-HUNT': '黑夜也挡不住你追光的心',
      '送达王 DROP-MAX': '稳稳送到，使命必达',
      '戏精机长 DRAMA-PILOT': '一个普通任务都能拍成预告片',
      '稳如老狗 SAFE-DOG': '安全第一，稳得一批',
      '社牛飞手 CROWD-LOVER': '人越多飞得越嗨',
      '猫派救援师 CAT-SAVER': '为了一只猫可以飞到天涯海角',
      '乱飞艺术家 CHAOS-AIR': '没有航线就是最好的航线',
      '夜游人 NIGHT-GOGO': '夜深了才是你的主场',
      '浪漫病 LOVE-DROP': '飞行器也能制造浪漫',
      '赌命飞手 RISK-ONE': '续航低也要飞出精彩',
      '收藏癖 SHOT-HOARDER': '续航够长才能拍个够',
      '脑洞怪 WTF-AIR': '没有人知道你下一秒要干嘛'
    }
    return descriptions[personality] || ''
  },

  generateEventStory(events, earlyEnd) {
    if (!events || events.length === 0) {
      return '本次飞行一路顺风，没有遇到特殊事件。'
    }

    const stories = events.map((item, index) => {
      const event = item.event
      const result = item.result
      return `${index + 1}. 【${event.title}】${result.narration}`
    })

    if (earlyEnd) {
      stories.push('\n⚠️ 电量耗尽，飞行器紧急降落！')
    }

    return stories.join('\n')
  },

  generateBaseStory(task, droneConfig, twist, bonus, eventCount, earlyEnd, earlyEndReason) {
    const body = droneConfig?.droneConfig?.body || '飞行器'
    const scene = task?.name || '任务场景'
    const module = droneConfig?.droneConfig?.module || '特殊模块'
    const skin = droneConfig?.droneConfig?.shell || droneConfig?.droneConfig?.color || '独特外观'

    if (earlyEnd) {
      return `你的${body}在${scene}中执行任务时，${earlyEndReason}。${module}和${skin}风格让你在紧急情况下仍保持了体面。虽然任务未能完成，但你安全返回，了解了飞行器的极限。下次记得带上大电池！`
    }

    let eventPrefix = ''
    if (eventCount > 0) {
      eventPrefix = `飞行中遇到了${eventCount}次意外情况，你都做出了明智的选择。`
    }

    return `${eventPrefix}你的${body}在${scene}中顺利完成了任务。${module}让整个过程非常顺利，但因为${skin}风格意外触发了：${twist}。最后你不仅完成任务，还额外收获了：${bonus}。`
  },

  /**
   * 调用AI生成更丰富的飞行故事
   */
  async generateAIStory(events, task, droneConfig, earlyEnd, earlyEndReason) {
    if (!events || events.length === 0) return

    this.setData({ isGeneratingStory: true })

    // 构建事件历史上下文
    const eventContext = events.map((item, index) => {
      return `${index + 1}. 事件：${item.event.title}，描述：${item.event.description}，选择：${item.choiceText}`
    }).join('\n')

    // 获取飞行器配置详情
    const body = droneConfig?.droneConfig?.body || '标准飞行器'
    const module = droneConfig?.droneConfig?.module || '基础配置'
    const shell = droneConfig?.droneConfig?.shell || ''
    const accessory = droneConfig?.droneConfig?.accessory || ''
    const taskName = task?.name || '未知任务'

    const prompt = `你是一个飞行故事作家。请根据以下飞行记录，为用户生成一段连贯、精彩、有画面感的飞行故事。

## 任务信息
- 任务名称：${taskName}
- 飞行器类型：${body}
- 装备模块：${module}
- 外壳风格：${shell || '标准'}
- 点缀件：${accessory || '无'}

## 飞行事件记录
${eventContext}

## 额外信息
${earlyEnd ? `飞行因电量耗尽提前结束，原因：${earlyEndReason}` : '飞行顺利完成所有事件'}

## 创作要求
1. 故事要有起承转合，描述飞行过程中的心理活动和场景细节
2. 将用户的选择串联成一个完整的故事线
3. 根据飞行器配置和任务类型添加合理的细节
4. 故事要有感染力，让读者能够感受到飞行的乐趣
5. 长度控制在200-300字
6. 不要提及AI或具体的数值计算
7. 直接输出故事内容，不要加标题或标记

请开始创作：
`

    try {
      const response = await wx.request({
        url: `${DEEPSEEK_CONFIG.baseURL}/chat/completions`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
        },
        data: {
          model: DEEPSEEK_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的飞行故事作家，擅长创作生动、有画面感的飞行故事。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 800
        }
      })

      if (response.statusCode === 200 && response.data?.choices?.[0]?.message?.content) {
        const aiStory = response.data.choices[0].message.content.trim()
        this.setData({
          storyText: aiStory,
          isGeneratingStory: false
        })
      } else {
        this.setData({ isGeneratingStory: false })
      }
    } catch (error) {
      console.error('AI story generation failed:', error)
      this.setData({ isGeneratingStory: false })
    }
  },

  goSharePoster() {
    // 保存飞行人格信息到全局，供海报使用
    app.globalData.flightPersonality = this.data.flightPersonality
    app.globalData.flightScores = this.data.flightScores

    wx.navigateTo({
      url: '/packageA/pages/share-poster/share-poster'
    })
  },

  goHome() {
    // 清除临时数据
    app.globalData.currentFlightSession = null
    app.globalData.finalStats = null
    app.globalData.finalScore = null
    app.globalData.flightEarlyEnd = null
    app.globalData.flightScores = null
    app.globalData.flightPersonality = null
    app.globalData.flightSuccess = null

    wx.reLaunch({
      url: '/pages/index/index'
    })
  }
})