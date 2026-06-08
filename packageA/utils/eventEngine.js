// 事件引擎 - 基于 DeepSeek AI 生成事件（人生重开器模式）

const EVENT_TYPES = {
  WEATHER: 'weather',
  OBSTACLE: 'obstacle',
  EMERGENCY: 'emergency',
  OPPORTUNITY: 'opportunity'
}

// 任务场景配置（用于AI生成起点事件）
const TASK_SCENARIOS = {
  '暴雨校园奶茶速递': {
    context: '暴雨中的校园外卖配送场景',
    keywords: ['暴雨', '校园', '奶茶', '时间紧迫', '湿滑'],
    suggestedEvents: ['积水躲避', '雷电警告', '订单超时', '路况选择']
  },
  '蓝眼泪海边夜拍': {
    context: '海边夜景摄影，捕捉荧光海现象',
    keywords: ['夜景', '海边', '摄影', '荧光', '浪漫'],
    suggestedEvents: ['潮汐变化', '光线捕捉', '设备保护', '角度选择']
  },
  '樱花大道毕业跟拍': {
    context: '樱花树下的毕业照跟拍',
    keywords: ['樱花', '毕业', '跟拍', '浪漫', '人多'],
    suggestedEvents: ['人群控制', '光线把握', '设备稳定', '角度创意']
  },
  '天台告白玫瑰空投': {
    context: '天台告白场景，精准空投玫瑰',
    keywords: ['天台', '告白', '玫瑰', '浪漫', '精准'],
    suggestedEvents: ['气流判断', '落点控制', '浪漫氛围', '紧急情况']
  },
  '音乐节空中运镜': {
    context: '音乐节现场空中运镜拍摄',
    keywords: ['音乐节', '人群', '灯光', '动感', '嘈杂'],
    suggestedEvents: ['人群上方飞行', '信号干扰', '设备散热', '电池管理']
  },
  '宿舍深夜外卖救援': {
    context: '深夜宿舍外卖紧急配送',
    keywords: ['深夜', '宿舍', '外卖', '紧急', '安静'],
    suggestedEvents: ['安静飞行', '楼梯间穿行', '门禁问题', '速度选择']
  },
  '博物馆夜间秘密导览': {
    context: '博物馆闭馆后的VIP夜间导览',
    keywords: ['博物馆', '夜间', '安静', '导览', '神秘'],
    suggestedEvents: ['静音飞行', '展品保护', '照明控制', '路线规划']
  },
  '山谷露营物资空投': {
    context: '山谷露营区物资空投',
    keywords: ['山谷', '露营', '地形复杂', '气流不稳', '物资'],
    suggestedEvents: ['气流躲避', '落点选择', '物资捆绑', '天气变化']
  },
  '未来城市低空巡游': {
    context: '未来城市风格的低空巡航',
    keywords: ['城市', '霓虹', '高楼', '低空', '科技'],
    suggestedEvents: ['楼宇间隙', '信号干扰', '灯光秀', '路线规划']
  },
  '屋顶猫咪营救': {
    context: '屋顶猫咪紧急救援',
    keywords: ['屋顶', '猫咪', '救援', '狭窄', '小心'],
    suggestedEvents: ['精准降落', '猫咪安抚', '抓取操作', '安全撤离']
  }
}

// 默认场景配置
const DEFAULT_SCENARIO = {
  context: '通用飞行场景',
  keywords: ['飞行', '任务', '挑战'],
  suggestedEvents: ['天气变化', '信号干扰', '设备检查', '路线选择']
}

// DeepSeek API 配置
const DEEPSEEK_CONFIG = {
  baseURL: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  apiKey: (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY) || 'sk-b209dca5ace54be9b29668609e2f1e95'
}

// 电量消耗配置
const BATTERY_CONFIG = {
  bigBattery: { maxEvents: 6, consumptionPerEvent: 12 },
  normal: { maxEvents: 6, consumptionPerEvent: 14 }
}

// 全局状态
let currentBattery = 100
let eventHistory = []
let maxEvents = 5
let conversationHistory = []

// 多维飞行评分
let flightScores = {
  braveIndex: 0,    // 勇敢指数
  creativeIndex: 0,  // 创意指数
  stableIndex: 0,   // 稳定指数
  funIndex: 0       // 趣味指数
}

const EventEngine = {
  /**
   * 初始化飞行会话
   */
  initFlightSession(stats, selectedModules) {
    currentBattery = stats?.duration || 50
    eventHistory = []
    flightScores = { braveIndex: 0, creativeIndex: 0, stableIndex: 0, funIndex: 0 }

    if (selectedModules?.includes('bigBattery')) {
      maxEvents = BATTERY_CONFIG.bigBattery.maxEvents
    } else {
      maxEvents = BATTERY_CONFIG.normal.maxEvents
    }
  },

  /**
   * 获取起点事件（通过AI生成）
   */
  async getStartingEvent(taskName) {
    eventHistory = []
    conversationHistory = []

    const prompt = this.buildStartingEventPrompt(taskName)

    const apiKey = DEEPSEEK_CONFIG.apiKey
    const url = 'https://api.deepseek.com/chat/completions'

    const messages = [
      { role: 'system', content: '你是飞行事件生成器。生成起点事件，返回JSON：{"title":"2-4字","description":"70-100字","type":"类型","choices":[{"id":"a","text":"2-4字","description":"5-8字","statEffects":{"duration":-10~5,"stability":-10~10,"fun":-5~25},"scoreBonus":-10~25},{"id":"b","text":"2-4字","description":"5-8字","statEffects":{...},"scoreBonus":...}]}' },
      { role: 'user', content: prompt }
    ]

    try {
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          data: {
            model: 'deepseek-chat',
            messages: messages
          },
          success: resolve,
          fail: reject
        })
      })

      console.log('起点事件 API 响应:', response.statusCode, JSON.stringify(response.data))

      if (response.statusCode === 200 && response.data?.choices?.[0]?.message?.content) {
        const content = response.data.choices[0].message.content.trim()
        conversationHistory.push({ role: 'assistant', content })
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          const event = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
          return this.validateEvent(event)
        } catch (e) {
          console.error('起点事件 JSON 解析失败:', e)
          return this.getContextualFallbackEvent({ task: { name: taskName } })
        }
      }

      console.error('起点事件 API 失败:', response.statusCode, JSON.stringify(response.data))
      return this.getContextualFallbackEvent({ task: { name: taskName } })
    } catch (err) {
      console.error('起点事件请求异常:', err)
      return this.getContextualFallbackEvent({ task: { name: taskName } })
    }
  },

  /**
   * 构建起点事件生成的prompt
   */
  buildStartingEventPrompt(taskName) {
    const scenario = TASK_SCENARIOS[taskName] || DEFAULT_SCENARIO

    let prompt = `为一个飞行任务生成精彩的起点事件。\n\n`
    prompt += `## 任务信息\n`
    prompt += `- 任务名称：${taskName}\n`
    prompt += `- 场景背景：${scenario.context}\n`
    prompt += `- 关键词：${scenario.keywords.join('、')}\n\n`

    prompt += `## 要求\n`
    prompt += `1. 起点事件应该展现任务的独特场景和氛围\n`
    prompt += `2. 选项A和选项B应该有明显的风格差异（一个偏冒险，一个偏稳妥）\n`
    prompt += `3. 每个选项的statEffects需要合理（duration: -10到5, stability: -10到10, fun: -5到25）\n`
    prompt += `4. scoreBonus需要与选项的风险/收益匹配（冒险选项更高）\n\n`

    prompt += `请生成一个精彩的起点事件，让用户感受到这次飞行的独特氛围。`

    return prompt
  },

  /**
   * 获取当前电量
   */
  getCurrentBattery() {
    return currentBattery
  },

  /**
   * 获取剩余事件数
   */
  getRemainingEvents() {
    return maxEvents - eventHistory.length
  },

  /**
   * 检查是否电量耗尽
   */
  isBatteryDepleted() {
    return currentBattery <= 0
  },

  /**
   * 检查是否还有事件
   */
  hasMoreEvents() {
    return eventHistory.length < maxEvents && currentBattery > 0
  },

  /**
   * 获取多维飞行评分
   */
  getFlightScores() {
    return { ...flightScores }
  },

  /**
   * 使用 DeepSeek AI 生成下一个事件
   */
  async generateNextEvent(context, eventIndex = 0, isFinalEvent = false) {
    const prompt = this.buildEventPrompt(context, eventIndex, isFinalEvent)

    const apiKey = DEEPSEEK_CONFIG.apiKey
    const url = 'https://api.deepseek.com/chat/completions'

    const messages = [
      { role: 'system', content: '你是飞行事件生成器。生成事件，返回JSON：{"title":"2-4字","description":"50-70字","type":"类型","choices":[{"id":"a","text":"2-4字","description":"5-8字","statEffects":{"duration":-10~5,"stability":-10~10,"fun":-5~25},"scoreBonus":-10~25},{"id":"b","text":"2-4字","description":"5-8字","statEffects":{...},"scoreBonus":...}]}' },
      ...conversationHistory,
      { role: 'user', content: prompt }
    ]

    try {
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          data: {
            model: 'deepseek-chat',
            messages: messages
          },
          success: resolve,
          fail: reject
        })
      })

      console.log('生成事件 API 响应:', response.statusCode, JSON.stringify(response.data))

      if (response.statusCode === 200 && response.data?.choices?.[0]?.message?.content) {
        const content = response.data.choices[0].message.content.trim()
        conversationHistory.push({ role: 'assistant', content })
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          const event = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
          return this.validateEvent(event)
        } catch (e) {
          console.error('事件 JSON 解析失败:', e)
          return this.getContextualFallbackEvent(context)
        }
      }

      console.error('生成事件 API 失败:', response.statusCode, JSON.stringify(response.data))
      return this.getContextualFallbackEvent(context)
    } catch (err) {
      console.error('生成事件请求异常:', err)
      return this.getContextualFallbackEvent(context)
    }
  },

  /**
   * 构建事件生成 prompt（增强版：传递完整上下文）
   */
  buildEventPrompt(context, eventIndex = 0, isFinalEvent = false) {
    const { task, droneConfig, currentBattery, stats, lastEvent, lastChoice, eventScores } = context

    // 从 droneConfig 中提取详细配置
    const body = droneConfig?.body || '标准飞行器'
    const module = droneConfig?.module || '无'
    const shell = droneConfig?.shell || ''
    const accessory = droneConfig?.accessory || ''

    // 分析已选模块的特征
    const moduleFeatures = this.analyzeModuleFeatures(module)

    let prompt = `生成飞行模拟器的下一个随机事件。\n\n`
    prompt += `## 当前任务\n`
    prompt += `- 任务名称：${task?.name || '未知任务'}\n`
    prompt += `- 任务模块：${module}\n`
    prompt += `- 飞行器母体：${body}\n`
    prompt += `- 外壳风格：${shell}\n`
    prompt += `- 点缀件：${accessory}\n\n`

    prompt += `## 飞行器特征\n`
    prompt += `- ${moduleFeatures}\n\n`

    prompt += `## 当前状态\n`
    prompt += `- 当前电量：${currentBattery}%\n`
    prompt += `- 续航属性：${stats?.duration || 50}\n`
    prompt += `- 稳定属性：${stats?.stability || 50}\n`
    prompt += `- 趣味属性：${stats?.fun || 50}\n`
    prompt += `- 事件进度：${eventIndex + 1}/6\n\n`

    // 飞行评分维度
    prompt += `## 当前飞行评分（多维评分）\n`
    prompt += `- 勇敢指数：${eventScores?.braveIndex || 0}（影响高空、高速等冒险选项）\n`
    prompt += `- 创意指数：${eventScores?.creativeIndex || 0}（影响独特、惊艳的选择）\n`
    prompt += `- 稳定指数：${eventScores?.stableIndex || 0}（影响安全、稳妥的选择）\n`
    prompt += `- 趣味指数：${eventScores?.funIndex || 0}（影响娱乐、搞笑的选择）\n\n`

    if (lastEvent && lastChoice) {
      prompt += `## 上一事件回顾\n`
      prompt += `- 事件："${lastEvent.title}"\n`
      prompt += `- 用户选择："${lastChoice.text}"\n`
      prompt += `- 选择结果：${lastChoice.description || '效果不错'}\n\n`
    }

    if (eventHistory.length > 0) {
      prompt += `## 事件历史（用于保持故事连贯）\n`
      eventHistory.slice(-3).forEach((h, i) => {
        prompt += `${i + 1}. ${h.event.title} → ${h.choice.text}\n`
      })
      prompt += `\n`
    }

    // 根据电量调整事件严重程度
    if (currentBattery < 30) {
      prompt += `⚠️ 紧急状态：电量低于30%，生成与电量相关的紧急事件（如电量告急、紧急降落等）\n`
    } else if (currentBattery < 60) {
      prompt += `注意：电量中等，可能出现一些挑战性事件\n`
    }

    // 任务特定场景提示
    prompt += `\n## 任务场景要求\n`
    if (task?.name) {
      prompt += this.getTaskScenarioHint(task.name, module)
    }

    // 结局事件处理
    if (isFinalEvent) {
      const taskName = task?.name || '未知任务'
      // 根据任务名称生成对应的结局判断
      const taskOutcomeHint = this.getTaskOutcomeHint(taskName)
      prompt += `\n🚨 重要：这是第6个事件（最后一个事件）！\n`
      prompt += `必须生成一个与任务结果相关的结局事件：\n`
      prompt += `${taskOutcomeHint}\n`
      prompt += `1. 事件描述要直接体现任务完成情况\n`
      prompt += `2. choices中必须包含"成功"和"失败"两个选项，对应任务是否完成\n`
      prompt += `3. 选项的statEffects要体现最终结果（如成功给高分加成，失败给负分）\n`
    }

    prompt += `\n请生成一个与上一事件有关联的新事件，类型不要与上一事件完全相同。确保事件与飞行器配置和任务相关联。`

    return prompt
  },

  /**
   * 分析模块特征
   */
  analyzeModuleFeatures(moduleStr) {
    if (!moduleStr || moduleStr === '无') return '基础配置飞行器'

    const features = []
    if (moduleStr.includes('夜拍相机')) features.push('适合夜景拍摄')
    if (moduleStr.includes('云台稳定器')) features.push('画面超级稳定')
    if (moduleStr.includes('大电池')) features.push('续航能力强')
    if (moduleStr.includes('小货仓')) features.push('可以携带物品')
    if (moduleStr.includes('探照灯')) features.push('照明能力出众')
    if (moduleStr.includes('抓取爪')) features.push('可以抓取物体')
    if (moduleStr.includes('扬声器')) features.push('可以发声')
    if (moduleStr.includes('情绪灯带')) features.push('氛围感十足')

    return features.length > 0 ? features.join('；') : '特殊配置飞行器'
  },

  /**
   * 获取任务场景提示
   */
  getTaskScenarioHint(taskName, moduleStr) {
    const hints = {
      '暴雨校园奶茶速递': '场景关键词：暴雨、校园、奶茶、时间紧迫。可以利用探照灯在雨天探索，或用云台稳定器确保配送安全。',
      '蓝眼泪海边夜拍': '场景关键词：夜景、海边、荧光、摄影。适合夜拍相机、情绪灯带发挥效果。',
      '樱花大道毕业跟拍': '场景关键词：樱花、毕业、跟拍、浪漫。云台稳定器和夜拍相机可以拍出唯美画面。',
      '天台告白玫瑰空投': '场景关键词：天台、告白、玫瑰、浪漫。扬声器和情绪灯带可以增加浪漫氛围。',
      '音乐节空中运镜': '场景关键词：音乐节、动感、灯光、人群。大电池续航、探照灯效果佳。',
      '宿舍深夜外卖救援': '场景关键词：深夜、宿舍、外卖、紧急。速度优先，大电池加分。',
      '博物馆夜间秘密导览': '场景关键词：博物馆、夜间、安静、导览。探照灯和情绪灯带可以营造神秘感。',
      '山谷露营物资空投': '场景关键词：山谷、露营、地形复杂。稳定性和续航很重要。',
      '未来城市低空巡游': '场景关键词：未来城市、霓虹灯、高楼。探照灯和情绪灯带可以展现科技感。',
      '屋顶猫咪营救': '场景关键词：屋顶、猫咪、救援。抓取爪是关键模块。'
    }

    return hints[taskName] || '根据任务特点生成合适的事件。'
  },

  /**
   * 获取任务结局提示（根据任务类型生成对应的成功/失败标准）
   */
  getTaskOutcomeHint(taskName) {
    const hints = {
      '暴雨校园奶茶速递': '这是送奶茶任务：成功 = 奶茶完好送达顾客手中；失败 = 奶茶打翻/超时/丢失',
      '蓝眼泪海边夜拍': '这是摄影任务：成功 = 拍到满意的蓝眼泪照片；失败 = 照片质量不佳/设备损坏',
      '樱花大道毕业跟拍': '这是跟拍任务：成功 = 毕业照顺利完成；失败 = 照片不满意/错失时机',
      '天台告白玫瑰空投': '这是空投任务：成功 = 玫瑰精准送达告白对象手中；失败 = 玫瑰丢失/空投失败',
      '音乐节空中运镜': '这是运镜任务：成功 = 拍到精彩的演出片段；失败 = 画面模糊/信号丢失',
      '宿舍深夜外卖救援': '这是外卖任务：成功 = 外卖准时送达；失败 = 外卖超时/被偷',
      '博物馆夜间秘密导览': '这是导览任务：成功 = 导览顺利完成；失败 = 被发现/设备出问题',
      '山谷露营物资空投': '这是空投任务：成功 = 物资精准送达营地；失败 = 物资丢失/落地损坏',
      '未来城市低空巡游': '这是巡游任务：成功 = 巡游顺利完成并记录；失败 = 信号中断/记录丢失',
      '屋顶猫咪营救': '这是救援任务：成功 = 猫咪成功救下；失败 = 猫咪逃跑/救援失败'
    }
    return hints[taskName] || '这是飞行任务：成功 = 任务圆满完成；失败 = 任务未能完成'
  },

  /**
   * 获取上下文相关的备用事件（扩充至 30+，确保飞行中不重复）
   */
  getContextualFallbackEvent(context) {
    const { task } = context
    const fallbacks = [
      // === 天气类 ===
      {
        id: 'weather_1', title: '阵风突袭', description: '突然一阵强风袭来', type: 'weather',
        choices: [
          { id: 's_a', text: '稳住飞行', description: '调整姿态对抗', statEffects: { duration: -5, stability: +5, fun: +5 }, scoreBonus: 5 },
          { id: 's_b', text: '借风滑行', description: '顺势而为省电', statEffects: { duration: +5, stability: -5, fun: +10 }, scoreBonus: 10 }
        ]
      },
      {
        id: 'weather_2', title: '暴雨突降', description: '天空突然下起暴雨', type: 'weather',
        choices: [
          { id: 's_a', text: '寻找避雨', description: '在屋檐下暂避', statEffects: { duration: -3, stability: +8, fun: 0 }, scoreBonus: 5 },
          { id: 's_b', text: '雨中飞行', description: '测试防水性能', statEffects: { duration: -12, stability: -5, fun: +15 }, scoreBonus: 12 }
        ]
      },
      {
        id: 'weather_3', title: '大雾弥漫', description: '浓雾覆盖了整个区域', type: 'weather',
        choices: [
          { id: 's_a', text: '降低高度', description: '到低空避开浓雾', statEffects: { duration: -5, stability: +5, fun: 0 }, scoreBonus: 5 },
          { id: 's_b', text: '盲飞穿越', description: '靠仪表飞行', statEffects: { duration: -8, stability: -8, fun: +12 }, scoreBonus: 8 }
        ]
      },
      {
        id: 'weather_4', title: '气温骤降', description: '环境温度急剧下降', type: 'weather',
        choices: [
          { id: 's_a', text: '增加悬停', description: '减少能耗保温', statEffects: { duration: -10, stability: +5, fun: 0 }, scoreBonus: 5 },
          { id: 's_b', text: '快速通过', description: '加急速离开冷区', statEffects: { duration: -15, stability: -3, fun: +8 }, scoreBonus: 8 }
        ]
      },
      {
        id: 'weather_5', title: '夕阳眩光', description: '夕阳恰好直射镜头', type: 'weather',
        choices: [
          { id: 's_a', text: '调转方向', description: '避开强光角度', statEffects: { duration: -5, stability: +3, fun: +5 }, scoreBonus: 5 },
          { id: 's_b', text: '逆光拍摄', description: '利用光晕出片', statEffects: { duration: -3, stability: -5, fun: +20 }, scoreBonus: 15 }
        ]
      },
      // === 障碍类 ===
      {
        id: 'obstacle_1', title: '飞鸟接近', description: '一只鸟好奇地靠近', type: 'obstacle',
        choices: [
          { id: 'o_a', text: '保持距离', description: '安全绕开', statEffects: { duration: -5, stability: +5, fun: 0 }, scoreBonus: 5 },
          { id: 'o_b', text: '靠近观察', description: '有趣但有风险', statEffects: { duration: 0, stability: -5, fun: +15 }, scoreBonus: 10 }
        ]
      },
      {
        id: 'obstacle_2', title: '树枝拦路', description: '前方有伸出的树枝', type: 'obstacle',
        choices: [
          { id: 'o_a', text: '绕行避让', description: '从旁边绕过去', statEffects: { duration: -8, stability: +5, fun: 0 }, scoreBonus: 5 },
          { id: 'o_b', text: '俯冲穿过', description: '从树枝下方穿过', statEffects: { duration: -3, stability: -8, fun: +10 }, scoreBonus: 10 }
        ]
      },
      {
        id: 'obstacle_3', title: '风筝靠近', description: '一个断了线的风筝飘来', type: 'obstacle',
        choices: [
          { id: 'o_a', text: '紧急避让', description: '快速规避', statEffects: { duration: -8, stability: +3, fun: 0 }, scoreBonus: 5 },
          { id: 'o_b', text: '帮忙回收', description: '用飞行器钩住风筝', statEffects: { duration: -15, stability: -5, fun: +18 }, scoreBonus: 15 }
        ]
      },
      {
        id: 'obstacle_4', title: '电线纵横', description: '前方区域有许多电线', type: 'obstacle',
        choices: [
          { id: 'o_a', text: '绕道而行', description: '找安全的路线', statEffects: { duration: -12, stability: +8, fun: 0 }, scoreBonus: 5 },
          { id: 'o_b', text: '精准穿梭', description: '在电线间隙穿行', statEffects: { duration: -5, stability: -10, fun: +15 }, scoreBonus: 12 }
        ]
      },
      {
        id: 'obstacle_5', title: '小孩围观', description: '一群小孩好奇地围观', type: 'obstacle',
        choices: [
          { id: 'o_a', text: '保持高度', description: '飞高一点避让', statEffects: { duration: -3, stability: +5, fun: 0 }, scoreBonus: 5 },
          { id: 'o_b', text: '展示特技', description: '表演一下吸引小孩', statEffects: { duration: -8, stability: -3, fun: +18 }, scoreBonus: 12 }
        ]
      },
      {
        id: 'obstacle_6', title: '无人机相遇', description: '另一架无人机迎面飞来', type: 'obstacle',
        choices: [
          { id: 'o_a', text: '主动避让', description: '调整航向规避', statEffects: { duration: -5, stability: +5, fun: 0 }, scoreBonus: 5 },
          { id: 'o_b', text: '空中互动', description: '和对方打招呼', statEffects: { duration: -8, stability: -5, fun: +12 }, scoreBonus: 8 }
        ]
      },
      // === 紧急类 ===
      {
        id: 'emergency_1', title: '信号微弱', description: '控制信号不太稳定', type: 'emergency',
        choices: [
          { id: 'e_a', text: '降低高度', description: '改善信号质量', statEffects: { duration: -8, stability: +5, fun: -5 }, scoreBonus: 0 },
          { id: 'e_b', text: '增强信号', description: '消耗更多电量', statEffects: { duration: -15, stability: +10, fun: 5 }, scoreBonus: 5 }
        ]
      },
      {
        id: 'emergency_2', title: '电量告急', description: '电量已经低于 20%', type: 'emergency',
        choices: [
          { id: 'e_a', text: '立即返航', description: '安全第一', statEffects: { duration: -5, stability: +8, fun: 0 }, scoreBonus: 0 },
          { id: 'e_b', text: '坚持任务', description: '赌一把能撑到最后', statEffects: { duration: -20, stability: -5, fun: +12 }, scoreBonus: 10 }
        ]
      },
      {
        id: 'emergency_3', title: '电机异响', description: '电机发出异常噪音', type: 'emergency',
        choices: [
          { id: 'e_a', text: '减速检查', description: '降低转速排查', statEffects: { duration: -10, stability: +10, fun: 0 }, scoreBonus: 0 },
          { id: 'e_b', text: '强行继续', description: '赌一把没问题', statEffects: { duration: -8, stability: -12, fun: +8 }, scoreBonus: 8 }
        ]
      },
      {
        id: 'emergency_4', title: 'GPS 丢失', description: '卫星信号突然断开', type: 'emergency',
        choices: [
          { id: 'e_a', text: '切换模式', description: '切换视觉定位', statEffects: { duration: -5, stability: +5, fun: 0 }, scoreBonus: 5 },
          { id: 'e_b', text: '手动操控', description: '靠飞手经验操作', statEffects: { duration: -8, stability: -8, fun: +10 }, scoreBonus: 8 }
        ]
      },
      {
        id: 'emergency_5', title: '路人投诉', description: '有人投诉飞行器太吵', type: 'emergency',
        choices: [
          { id: 'e_a', text: '立即升高', description: '减少噪音影响', statEffects: { duration: -3, stability: +5, fun: 0 }, scoreBonus: 5 },
          { id: 'e_b', text: '快速撤离', description: '迅速完成离开', statEffects: { duration: -10, stability: -3, fun: +5 }, scoreBonus: 5 }
        ]
      },
      {
        id: 'emergency_6', title: '摄像头模糊', description: '镜头被水雾遮挡', type: 'emergency',
        choices: [
          { id: 'e_a', text: '降落清洁', description: '清理后继续', statEffects: { duration: -12, stability: +8, fun: 0 }, scoreBonus: 3 },
          { id: 'e_b', text: '盲飞继续', description: '凭感觉完成', statEffects: { duration: -5, stability: -10, fun: +10 }, scoreBonus: 8 }
        ]
      },
      // === 机会类 ===
      {
        id: 'opp_1', title: '绝美景色', description: '前方出现绝美的日落景色', type: 'opportunity',
        choices: [
          { id: 'p_a', text: '停下拍摄', description: '记录这美丽一刻', statEffects: { duration: -5, stability: +3, fun: +15 }, scoreBonus: 10 },
          { id: 'p_b', text: '加速赶路', description: '任务优先', statEffects: { duration: +3, stability: +5, fun: -5 }, scoreBonus: 0 }
        ]
      },
      {
        id: 'opp_2', title: '热源信号', description: '热成像仪发现异常热源', type: 'opportunity',
        choices: [
          { id: 'p_a', text: '前往查看', description: '看看有什么', statEffects: { duration: -10, stability: 0, fun: +20 }, scoreBonus: 12 },
          { id: 'p_b', text: '忽略信号', description: '专注当前任务', statEffects: { duration: 0, stability: +5, fun: 0 }, scoreBonus: 3 }
        ]
      },
      {
        id: 'opp_3', title: '顺风气流', description: '出现一股强劲的顺风', type: 'opportunity',
        choices: [
          { id: 'p_a', text: '借风加速', description: '省电又快速', statEffects: { duration: +10, stability: +3, fun: +5 }, scoreBonus: 8 },
          { id: 'p_b', text: '谨慎飞行', description: '保持现有速度', statEffects: { duration: -3, stability: +8, fun: 0 }, scoreBonus: 5 }
        ]
      },
      {
        id: 'opp_4', title: '发现捷径', description: '发现一条更快的路线', type: 'opportunity',
        choices: [
          { id: 'p_a', text: '走捷径', description: '节省时间但未知', statEffects: { duration: +5, stability: -5, fun: +8 }, scoreBonus: 8 },
          { id: 'p_b', text: '按计划走', description: '稳妥但更慢', statEffects: { duration: -8, stability: +8, fun: 0 }, scoreBonus: 5 }
        ]
      },
      {
        id: 'opp_5', title: '遇见同行', description: '遇到另一个飞手在操作飞行器', type: 'opportunity',
        choices: [
          { id: 'p_a', text: '组队飞行', description: '一起完成任务', statEffects: { duration: -5, stability: +5, fun: +12 }, scoreBonus: 10 },
          { id: 'p_b', text: '独自行动', description: '专注自己的任务', statEffects: { duration: 0, stability: +5, fun: 0 }, scoreBonus: 3 }
        ]
      },
      {
        id: 'opp_6', title: '飘落花瓣', description: '樱花飘落在航线周围', type: 'opportunity',
        choices: [
          { id: 'p_a', text: '穿过花雨', description: '拍一段唯美视频', statEffects: { duration: -5, stability: -3, fun: +22 }, scoreBonus: 15 },
          { id: 'p_b', text: '绕道避开', description: '避免花粉影响镜头', statEffects: { duration: -5, stability: +5, fun: 0 }, scoreBonus: 3 }
        ]
      },
      {
        id: 'opp_7', title: '免费充电站', description: '发现一个无人机充电站', type: 'opportunity',
        choices: [
          { id: 'p_a', text: '停下充电', description: '充到 80%', statEffects: { duration: +25, stability: +5, fun: -5 }, scoreBonus: 5 },
          { id: 'p_b', text: '继续飞行', description: '省时间', statEffects: { duration: -5, stability: +3, fun: +3 }, scoreBonus: 3 }
        ]
      }
    ]

    // 尽量不重复：如果已经发生过的事件，跳过
    const usedIds = eventHistory.map((h) => h.event.id)
    const fresh = fallbacks.filter((f) => !usedIds.includes(f.id))
    const pool = fresh.length >= 2 ? fresh : fallbacks
    return pool[Math.floor(Math.random() * pool.length)]
  },

  /**
   * 验证事件格式
   */
  validateEvent(event) {
    if (!event.title || !event.description || !event.type || !event.choices || event.choices.length !== 2) {
      return this.getContextualFallbackEvent({ task: null })
    }

    const validChoices = event.choices.every(c =>
      c.id && c.text && c.description &&
      typeof c.statEffects === 'object' &&
      typeof c.scoreBonus === 'number'
    )

    if (!validChoices) {
      return this.getContextualFallbackEvent({ task: null })
    }

    return {
      id: `ai_event_${Date.now()}`,
      title: event.title,
      description: event.description,
      type: event.type,
      choices: event.choices.map((c, i) => ({
        id: `choice_${i}`,
        text: c.text,
        description: c.description,
        statEffects: {
          duration: Math.max(-20, Math.min(10, c.statEffects.duration || 0)),
          stability: Math.max(-15, Math.min(15, c.statEffects.stability || 0)),
          fun: Math.max(-10, Math.min(25, c.statEffects.fun || 0))
        },
        scoreBonus: Math.max(-10, Math.min(25, c.scoreBonus || 0))
      }))
    }
  },

  /**
   * 获取备用事件（当AI失败时）
   */
  getFallbackEvent() {
    return this.getContextualFallbackEvent({ task: null })
  },

  /**
   * 处理玩家选择（增强版：计算多维评分）
   */
  processChoice(event, choiceId, customText, currentStats) {
    let choice
    let isCustom = false

    if (choiceId === 'custom' || choiceId === 'custom_input') {
      choice = {
        id: 'custom',
        text: customText || '自由发挥',
        description: '自定义行动',
        statEffects: { duration: -8, stability: 0, fun: +10 },
        scoreBonus: 8
      }
      isCustom = true
    } else {
      choice = event.choices.find(c => c.id === choiceId)
      if (!choice) return null
    }

    // 更新电量
    currentBattery = Math.max(0, currentBattery + choice.statEffects.duration)

    // 更新多维飞行评分
    this.updateFlightScores(choice, event)

    // 记录历史
    eventHistory.push({ event, choice, isCustom })

    // 生成叙述
    const narration = this.generateNarration(event, choice, isCustom, currentBattery)

    return {
      eventId: event.id,
      eventTitle: event.title,
      choiceId: choice.id,
      choiceText: choice.text,
      customText: isCustom ? customText : null,
      statEffects: choice.statEffects,
      scoreBonus: choice.scoreBonus,
      narration,
      remainingBattery: currentBattery,
      remainingEvents: maxEvents - eventHistory.length
    }
  },

  /**
   * 更新多维飞行评分
   */
  updateFlightScores(choice, event) {
    // 勇敢指数：与冒险性选择相关
    if (choice.statEffects.stability < -5 || choice.scoreBonus > 10) {
      flightScores.braveIndex += Math.abs(choice.statEffects.stability) > 8 ? 3 : 1
    }

    // 创意指数：与趣味性选择相关
    if (choice.statEffects.fun > 10) {
      flightScores.creativeIndex += 2
    } else if (choice.statEffects.fun > 5) {
      flightScores.creativeIndex += 1
    }

    // 稳定指数：与稳定性提升相关
    if (choice.statEffects.stability > 5) {
      flightScores.stableIndex += 1
    }

    // 趣味指数：与整体体验相关
    flightScores.funIndex += Math.max(0, choice.scoreBonus)

    // 确保评分不超过上限
    flightScores.braveIndex = Math.min(100, flightScores.braveIndex)
    flightScores.creativeIndex = Math.min(100, flightScores.creativeIndex)
    flightScores.stableIndex = Math.min(100, flightScores.stableIndex)
    flightScores.funIndex = Math.min(100, flightScores.funIndex)
  },

  /**
   * 生成叙述文本
   */
  generateNarration(event, choice, isCustom, remainingBattery) {
    if (isCustom) {
      return `你决定"${choice.text}"，${remainingBattery > 30 ? '效果不错' : '有些艰难'}`
    }

    // 基于事件的叙述
    const eventNarrations = {
      'takeoff_check': {
        'smooth_takeoff': '你平稳起飞，完美通过检查',
        'aggressive_takeoff': '你加速拉升，展现了飞行器性能'
      },
      'wind_burst': {
        'stabilize': '你稳住飞行器，成功对抗阵风',
        'ride_wind': '你借势滑行，省了不少电量'
      },
      'bird_nearby': {
        'keep_distance': '你保持安全距离，鸟儿飞走了',
        'approach': '你靠近观察，近距离接触了这只鸟'
      },
      'signal_weak': {
        'reduce_altitude': '你降低高度，信号恢复了稳定',
        'boost_signal': '你增强信号发射，通信质量提升了'
      }
    }

    const narrationMap = eventNarrations[event.id]
    if (narrationMap && narrationMap[choice.id]) {
      return narrationMap[choice.id]
    }

    // 电量不足提示
    if (remainingBattery < 30) {
      return `你选择了"${choice.text}"，电量告急！`
    }

    return `你选择了"${choice.text}"`
  },

  /**
   * 获取事件类型信息
   */
  getEventTypeInfo(type) {
    const typeInfo = {
      weather: { name: '天气', icon: '🌤', color: '#4A90D9' },
      obstacle: { name: '障碍', icon: '⚠️', color: '#E6A23C' },
      emergency: { name: '紧急', icon: '🚨', color: '#F56C6C' },
      opportunity: { name: '机会', icon: '✨', color: '#67C23A' }
    }
    return typeInfo[type] || { name: '事件', icon: '📌', color: '#909399' }
  },

  /**
   * 获取所有已发生的事件
   */
  getEventHistory() {
    return eventHistory
  },

  /**
   * 设置 API Key
   */
  setApiKey(key) {
    DEEPSEEK_CONFIG.apiKey = key
  },

  /**
   * 获取当前配置
   */
  getConfig() {
    return { ...DEEPSEEK_CONFIG }
  }
}

module.exports = EventEngine