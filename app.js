// app.js
const { hashPassword } = require('./utils/crypto.js')
const { storage, STORAGE_KEYS } = require('./utils/storage.js')

App({
  onLaunch() {
    // 初始化管理员账号（如果不存在）
    this.initAdminUser()

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查登录状态
    this.checkLoginStatus()

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.loginCode = res.code
      },
      fail: err => {
        console.error('获取登录凭证失败:', err)
      }
    })

    // 初始化全局数据
    this.initGlobalData()

    // 首次启动：未看过产品介绍则跳转 onboarding
    this.maybeShowOnboarding()
  },

  /**
   * 检查是否首次启动；未看过则 1.5s 后跳转到 onboarding
   */
  maybeShowOnboarding() {
    try {
      const seen = wx.getStorageSync('skihive_onboarding_seen')
      if (seen) return
      // 延迟 1.5s 跳转，让用户先看到首屏 logo
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/onboarding/onboarding' })
      }, 1500)
    } catch (e) {
      console.error('[app] 检查 onboarding 状态失败', e)
    }
  },

  onError(err) {
    console.error('应用错误:', err)
    // 可以在这里添加错误上报逻辑
  },

  globalData: {
    userInfo: null,
    loginCode: '',
    isLoggedIn: false,
    isAdmin: false,
    /** 装配页传给飞行页的已选组件 id 列表，如 ['frame','propeller'] */
    assemblySelection: null,
    /** 飞行数据 */
    flightData: {
      flightTime: 0,
      flightStatus: '未飞行',
      evaluationScore: null
    },
    /** 环境选择 */
    environment: {
      selectedId: null,
      name: '',
      description: ''
    },
    /** 当前任务 */
    currentTask: null,
    /** 当前飞行配置 */
    currentFlight: null,
    /** 飞行会话（事件相关） */
    currentFlightSession: null,
    /** 飞行结果（事件计算后的最终属性） */
    finalStats: null,
    finalScore: null
  },

  /**
   * 初始化管理员账号（如果不存在或版本过旧）
   */
  initAdminUser() {
    const users = storage.getUsers()
    const adminUser = users['admin']
    // 检查是否需要创建或更新管理员账号（版本号用于检测算法更新）
    const needsUpdate = !adminUser || adminUser.version !== 2
    if (needsUpdate) {
      users['admin'] = {
        version: 2,
        password: hashPassword('123456'),
        nickname: '管理员',
        createdAt: adminUser ? adminUser.createdAt : Date.now()
      }
      storage.setUsers(users)
    }
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const isLoggedIn = storage.getLoginStatus()
    const userInfo = storage.getUserInfo()

    if (isLoggedIn && userInfo) {
      this.globalData.isLoggedIn = true
      this.globalData.userInfo = userInfo
    } else {
      this.globalData.isLoggedIn = false
      this.globalData.userInfo = null
    }
  },

  /**
   * 初始化全局数据
   */
  initGlobalData() {
    const savedData = storage.getGlobalDataBackup()
    if (savedData) {
      const { environment, currentTask, currentFlight, flightData, assemblySelection } = savedData
      if (environment) this.globalData.environment = environment
      if (currentTask) this.globalData.currentTask = currentTask
      if (currentFlight) this.globalData.currentFlight = currentFlight
      if (flightData) this.globalData.flightData = flightData
      if (assemblySelection) this.globalData.assemblySelection = assemblySelection
    }
  },

  /**
   * 保存全局数据到本地存储（不保存敏感信息）
   */
  saveGlobalData() {
    const { environment, currentTask, currentFlight, flightData, assemblySelection } = this.globalData
    storage.setGlobalDataBackup({ environment, currentTask, currentFlight, flightData, assemblySelection })
  },

  /**
   * 更新装配信息
   */
  updateAssemblySelection(selection) {
    this.globalData.assemblySelection = selection
    this.saveGlobalData()
  },

  /**
   * 更新飞行数据
   */
  updateFlightData(data) {
    this.globalData.flightData = { ...this.globalData.flightData, ...data }
    this.saveGlobalData()
  },

  /**
   * 更新环境选择
   */
  updateEnvironment(environment) {
    this.globalData.environment = { ...this.globalData.environment, ...environment }
    this.saveGlobalData()
  },

  /**
   * 微信登录（仅设置用户信息和登录状态）
   */
  setWechatUser(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.isLoggedIn = true
    this.globalData.isAdmin = false

    storage.setLoginStatus(true)
    storage.setUserInfo(userInfo)

    this.saveGlobalData()
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    return {
      title: "低空装配与仿真平台",
      path: "/pages/index/index",
      imageUrl: "/assets/share.jpg",
      success: function(res) {
        console.log('分享成功:', res)
      },
      fail: function(err) {
        console.error('分享失败:', err)
      }
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: "低空装配与仿真平台 - 体验无人机装配与飞行评估",
      imageUrl: "/assets/share.jpg"
    }
  },

  /**
   * 用户注册（本地存储）- 密码已加密
   */
  register(email, password, nickname) {
    const users = storage.getUsers()

    if (users[email]) {
      return { success: false, message: '该邮箱已注册' }
    }

    // 密码使用 hashPassword 加密存储
    const encryptedPassword = hashPassword(password)

    users[email] = {
      password: encryptedPassword,
      nickname: nickname || email.split('@')[0],
      createdAt: Date.now()
    }

    storage.setUsers(users)
    return { success: true, message: '注册成功' }
  },

  /**
   * 用户登录（本地存储）- 验证加密密码
   */
  login(email, password) {
    const users = storage.getUsers()

    // 管理员账号验证
    if (email === 'admin') {
      const adminUser = users['admin']
      if (adminUser && adminUser.password === hashPassword(password)) {
        this.globalData.userInfo = { email: 'admin', nickname: '管理员', isAdmin: true }
        this.globalData.isLoggedIn = true
        this.globalData.isAdmin = true
        storage.setLoginStatus(true)
        storage.setUserInfo(this.globalData.userInfo)
        return { success: true, isAdmin: true }
      }
      return { success: false, message: '密码错误' }
    }

    if (!users[email]) {
      return { success: false, message: '用户不存在' }
    }

    // 验证加密后的密码
    const encryptedInput = hashPassword(password)
    if (users[email].password !== encryptedInput) {
      return { success: false, message: '密码错误' }
    }

    this.globalData.userInfo = { email, nickname: users[email].nickname, isAdmin: false }
    this.globalData.isLoggedIn = true
    this.globalData.isAdmin = false
    storage.setLoginStatus(true)
    storage.setUserInfo(this.globalData.userInfo)

    return { success: true, isAdmin: false }
  },

  /**
   * 登出
   */
  logout() {
    this.globalData.userInfo = null
    this.globalData.isLoggedIn = false
    this.globalData.isAdmin = false
    storage.remove(STORAGE_KEYS.IS_LOGGED_IN)
    storage.remove(STORAGE_KEYS.USER_INFO)
    this.saveGlobalData()
  },

  /**
   * 保存飞行记录
   */
  saveFlightRecord(record) {
    const records = storage.getFlightRecords()
    record.id = Date.now().toString()
    record.timestamp = Date.now()
    records.unshift(record)
    // 最多保留100条记录
    if (records.length > 100) {
      records.pop()
    }
    storage.set(STORAGE_KEYS.FLIGHT_RECORDS, records)
    return record
  },

  /**
   * 获取飞行记录（管理员可看全部）
   */
  getFlightRecords(userEmail, isAdmin) {
    const records = storage.getFlightRecords()
    if (isAdmin) {
      return records
    }
    return records.filter(r => r.userId === userEmail)
  },

  /**
   * 更新当前飞行配置
   */
  updateCurrentFlight(data) {
    this.globalData.currentFlight = { ...this.globalData.currentFlight, ...data }
    this.saveGlobalData()
  },

  /**
   * 更新当前任务
   */
  updateCurrentTask(task) {
    this.globalData.currentTask = task
    this.saveGlobalData()
  }
})
