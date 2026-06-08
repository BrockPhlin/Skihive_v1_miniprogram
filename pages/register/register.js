// register.js
const app = getApp()

const computeStrength = (pwd) => {
  if (!pwd) return { key: '', text: '—', percent: 0 }
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 2) return { key: 'weak', text: 'WEAK', percent: 33 }
  if (score <= 4) return { key: 'medium', text: 'MEDIUM', percent: 66 }
  return { key: 'strong', text: 'STRONG', percent: 100 }
}

Page({
  data: {
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    isLoading: false,
    showPassword: false,
    focusedField: '',
    passwordStrength: '',
    passwordStrengthText: '—',
    passwordStrengthPercent: 0
  },

  onFocusField() { this.setData({ focusedField: 'on' }) },
  onBlurField() { this.setData({ focusedField: '' }) },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword })
  },

  handleEmailInput(e) {
    this.setData({ email: e.detail.value })
  },

  handlePasswordInput(e) {
    const password = e.detail.value
    const s = computeStrength(password)
    this.setData({
      password,
      passwordStrength: s.key,
      passwordStrengthText: s.text,
      passwordStrengthPercent: s.percent
    })
  },

  handleConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value })
  },

  handleNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  handleSubmit(e) {
    const { email, password, confirmPassword, nickname } = this.data

    if (!email || !password || !confirmPassword) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    if (password !== confirmPassword) {
      wx.showToast({ title: '两次输入的密码不一致', icon: 'none' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      wx.showToast({ title: '请输入正确的邮箱格式', icon: 'none' })
      return
    }

    this.setData({ isLoading: true })

    const result = app.register(email, password, nickname || email.split('@')[0])

    this.setData({ isLoading: false })

    if (result.success) {
      wx.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/login/login' })
      }, 1500)
    } else {
      wx.showToast({ title: result.message, icon: 'none' })
    }
  },

  handleLogin() {
    wx.navigateTo({ url: '/pages/login/login' })
  }
})
