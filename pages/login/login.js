// login.js
const app = getApp()

Page({
  data: {
    email: '',
    password: '',
    isLoading: false,
    agreed: false,
    showPassword: false,
    focusedField: ''
  },

  onFocusEmail() { this.setData({ focusedField: 'email' }) },
  onFocusPassword() { this.setData({ focusedField: 'password' }) },
  onBlurField() { this.setData({ focusedField: '' }) },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword })
  },

  handleEmailInput(e) {
    this.setData({
      email: e.detail.value
    })
  },

  handlePasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  handleAgreeChange() {
    this.setData({
      agreed: !this.data.agreed
    })
  },

  handleSubmit(e) {
    const { email, password, agreed } = this.data

    if (!agreed) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      })
      return
    }

    if (!email || !password) {
      wx.showToast({
        title: '请输入邮箱和密码',
        icon: 'none'
      })
      return
    }

    this.setData({ isLoading: true })

    const result = app.login(email, password)

    this.setData({ isLoading: false })

    if (result.success) {
      wx.showToast({
        title: result.isAdmin ? '管理员登录成功' : '登录成功',
        icon: 'success',
        duration: 1500
      })

      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }, 1500)
    } else {
      wx.showToast({
        title: result.message,
        icon: 'none'
      })
    }
  },

  handleRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  handleWechatLogin(e) {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      })
      return
    }

    // 必须先获取用户信息，这是点击事件的第一行代码
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (userInfoRes) => {
        console.log('获取用户信息成功:', userInfoRes.userInfo)

        this.setData({ isLoading: true })

        // 再调用wx.login获取code
        wx.login({
          success: (res) => {
            if (res.code) {
              console.log('获取登录凭证code:', res.code)

              setTimeout(() => {
                this.setData({ isLoading: false })

                const app = getApp()
                app.setWechatUser(userInfoRes.userInfo)

                wx.showToast({
                  title: '微信登录成功',
                  icon: 'success',
                  duration: 1500
                })

                setTimeout(() => {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }, 1500)
              }, 1000)
            } else {
              console.error('微信登录失败，无法获取code:', res.errMsg)
              this.setData({ isLoading: false })
              wx.showToast({
                title: '微信登录失败，请检查网络',
                icon: 'none'
              })
            }
          },
          fail: (err) => {
            console.error('微信登录API调用失败:', err)
            this.setData({ isLoading: false })
            wx.showToast({
              title: '登录失败，请稍后重试',
              icon: 'none'
            })
          }
        })
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        wx.showToast({
          title: '获取用户信息失败，请重试',
          icon: 'none'
        })
      }
    })
  }
})