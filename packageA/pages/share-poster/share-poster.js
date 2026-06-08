// share-poster.js
const app = getApp()
const { computePersonality, PERSONALITIES } = require('../../../utils/personality')

Page({
  data: {
    task: null,
    droneConfig: {},
    personality: '',
    personalityDesc: '',
    stats: {},
    totalScore: 0,
    saving: false
  },

  onLoad() {
    const currentFlight = app.globalData.currentFlight
    const currentTask = app.globalData.currentTask

    const personality = computePersonality(currentFlight?.stats, currentTask?.name)

    this.setData({
      task: currentTask,
      droneConfig: currentFlight?.droneConfig || {},
      personality,
      personalityDesc: PERSONALITIES[personality] || '',
      stats: currentFlight?.stats || {},
      totalScore: currentFlight?.totalScore || 0
    })
  },

  savePoster() {
    if (this.data.saving) return
    this.setData({ saving: true })

    const that = this
    const { task, droneConfig, personality, personalityDesc, stats, totalScore } = this.data

    // 先请求相册权限
    wx.getSetting({
      success: (settingRes) => {
        if (!settingRes.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => that.drawAndSave(),
            fail: () => {
              wx.showModal({
                title: '提示',
                content: '需要相册权限才能保存海报，请在设置中开启',
                showCancel: false
              })
              that.setData({ saving: false })
            }
          })
        } else {
          that.drawAndSave()
        }
      }
    })
  },

  drawAndSave() {
    const that = this
    const { task, droneConfig, personality, personalityDesc, stats, totalScore } = this.data

    const query = wx.createSelectorQuery()
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0]) {
          that.fallbackCanvas()
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio

        const W = 540
        const H = 900
        canvas.width = W * dpr
        canvas.height = H * dpr
        ctx.scale(dpr, dpr)

        // 下载任务图片
        let taskImg = null
        const loadImage = (src, callback) => {
          if (!src) return callback(null)
          const img = canvas.createImage()
          img.onload = () => callback(img)
          img.onerror = () => callback(null)
          img.src = src
        }

        loadImage(task?.image, (imgTask) => {
          loadImage(droneConfig?.imageUrl, (imgDrone) => {
            that.drawPosterContent(ctx, W, H, imgTask, imgDrone)
            that.exportAndSave(canvas)
          })
        })
      })
  },

  drawPosterContent(ctx, W, H, taskImg, droneImg) {
    const { task, droneConfig, personality, personalityDesc, stats, totalScore } = this.data
    const padding = 30
    let y = padding

    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, H)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(0.5, '#16213e')
    gradient.addColorStop(1, '#0f3460')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, W, H)

    // ========== 顶部：飞行器展示 ==========
    if (droneImg) {
      const imgSize = 120
      ctx.drawImage(droneImg, W / 2 - imgSize / 2, y, imgSize, imgSize)
      y += imgSize + 10
    } else {
      ctx.font = '60px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('🛸', W / 2, y + 50)
      y += 70
    }

    ctx.font = 'bold 22px sans-serif'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.fillText(droneConfig.body || '自定义飞行器', W / 2, y)
    y += 28

    if (droneConfig.color) {
      ctx.font = '14px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.fillText(droneConfig.color, W / 2, y)
      y += 20
    } else {
      y += 10
    }

    // ========== 中部：任务图片和名称 ==========
    if (taskImg) {
      const imgW = W - padding * 2
      const imgH = 200
      ctx.save()
      // 圆角裁剪
      ctx.beginPath()
      const rx = padding, ry = y, rw = imgW, rh = imgH, radius = 12
      ctx.moveTo(rx + radius, ry)
      ctx.lineTo(rx + rw - radius, ry)
      ctx.arcTo(rx + rw, ry, rx + rw, ry + radius, radius)
      ctx.lineTo(rx + rw, ry + rh - radius)
      ctx.arcTo(rx + rw, ry + rh, rx + rw - radius, ry + rh, radius)
      ctx.lineTo(rx + radius, ry + rh)
      ctx.arcTo(rx, ry + rh, rx, ry + rh - radius, radius)
      ctx.lineTo(rx, ry + radius)
      ctx.arcTo(rx, ry, rx + radius, ry, radius)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(taskImg, rx, ry, rw, rh)
      ctx.restore()
      y += imgH + 15
    }

    // 任务名称
    ctx.font = 'bold 18px sans-serif'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.fillText(task?.name || '未知任务', W / 2, y + 20)
    y += 45

    // ========== 飞手人格 ==========
    ctx.textAlign = 'center'
    ctx.font = 'bold 26px sans-serif'
    ctx.fillStyle = '#855ee3'
    ctx.fillText(personality, W / 2, y + 20)
    ctx.font = '14px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillText(personalityDesc, W / 2, y + 40)
    y += 65

    // ========== 属性栏（纯数字，2x2网格）==========
    const statItems = [
      { label: '续航', value: stats.duration || 0 },
      { label: '稳定', value: stats.stability || 0 },
      { label: '趣味', value: stats.fun || 0 },
      { label: '综合', value: totalScore }
    ]

    const colW = (W - padding * 2) / 2
    const rowH = 50
    statItems.forEach((item, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const sx = padding + col * colW
      const sy = y + row * rowH

      ctx.textAlign = 'center'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillStyle = '#fff'
      ctx.fillText(String(item.value), sx + colW / 2, sy + 25)

      ctx.font = '14px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fillText(item.label, sx + colW / 2, sy + 42)
    })

    y += Math.ceil(statItems.length / 2) * rowH + 20

    // ========== 底部品牌 ==========
    ctx.textAlign = 'center'
    ctx.font = '13px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.fillText('SkiHive 低空装配与仿真平台', W / 2, H - 25)
  },

  exportAndSave(canvas) {
    const that = this
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvas: canvas,
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({ title: '海报已保存到相册', icon: 'success' })
              that.setData({ saving: false })
            },
            fail: (err) => {
              console.error('保存失败:', err)
              wx.showToast({ title: '保存失败，请重试', icon: 'none' })
              that.setData({ saving: false })
            }
          })
        },
        fail: (err) => {
          console.error('生成图片失败:', err)
          wx.showToast({ title: '生成失败，请重试', icon: 'none' })
          that.setData({ saving: false })
        }
      })
    }, 300)
  },

  // 降级方案：使用旧版 canvas API
  fallbackCanvas() {
    const ctx = wx.createCanvasContext('posterCanvas', this)
    const { task, droneConfig, personality, personalityDesc, stats, totalScore } = this.data
    const W = 270
    const H = 400
    let y = 30

    // 背景
    ctx.setFillStyle('#1a1a2e')
    ctx.fillRect(0, 0, W, H)

    // 飞行器
    ctx.setFontSize(40)
    ctx.setTextAlign('center')
    ctx.fillText('🛸', W / 2, y + 30)

    ctx.setFontSize(14)
    ctx.setFillStyle('#fff')
    ctx.fillText(droneConfig.body || '自定义飞行器', W / 2, y + 60)

    // 任务
    y = 100
    ctx.setFontSize(12)
    ctx.setFillStyle('#fff')
    ctx.fillText('任务：' + (task?.name || ''), W / 2, y)

    // 人格
    y = 130
    ctx.setFontSize(18)
    ctx.setFillStyle('#855ee3')
    ctx.fillText(personality, W / 2, y)

    ctx.setFontSize(10)
    ctx.setFillStyle('rgba(255,255,255,0.5)')
    ctx.fillText(personalityDesc, W / 2, y + 16)

    // 属性
    y = 170
    const items = [
      { l: '续航', v: stats.duration || 0 },
      { l: '稳定', v: stats.stability || 0 },
      { l: '趣味', v: stats.fun || 0 },
      { l: '综合', v: totalScore }
    ]
    items.forEach((item, i) => {
      ctx.setFontSize(10)
      ctx.setFillStyle('#fff')
      ctx.setTextAlign('left')
      ctx.fillText(item.l, 20, y + i * 25 + 8)
      ctx.setFillStyle('rgba(255,255,255,0.2)')
      ctx.fillRect(50, y + i * 25 + 3, 180, 6)
      ctx.setFillStyle('#855ee3')
      ctx.fillRect(50, y + i * 25 + 3, 180 * (item.v / 100), 6)
      ctx.setFontSize(12)
      ctx.setFillStyle('#fff')
      ctx.setTextAlign('right')
      ctx.fillText(String(item.v), W - 20, y + i * 25 + 8)
    })

    // 品牌
    ctx.setFontSize(10)
    ctx.setFillStyle('rgba(255,255,255,0.3)')
    ctx.setTextAlign('center')
    ctx.fillText('SkiHive 低空装配与仿真平台', W / 2, H - 20)

    const that = this
    ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'posterCanvas',
          success: (res) => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showToast({ title: '海报已保存到相册', icon: 'success' })
                that.setData({ saving: false })
              },
              fail: () => {
                wx.showToast({ title: '保存失败，请重试', icon: 'none' })
                that.setData({ saving: false })
              }
            })
          },
          fail: () => {
            wx.showToast({ title: '生成失败，请重试', icon: 'none' })
            that.setData({ saving: false })
          }
        })
      }, 500)
    })
  },

  goHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  goBack() {
    wx.navigateBack()
  },

  // 分享给朋友
  onShareAppMessage() {
    const { task, droneConfig, personality, totalScore } = this.data
    return {
      title: `${droneConfig.body || '自定义飞行器'} - ${personality}飞手 | SkiHive`,
      desc: `任务：${task?.name || '未知任务'} | 综合评分：${totalScore}`,
      path: '/pages/index/index'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { task, droneConfig, personality, totalScore } = this.data
    return {
      title: `${droneConfig.body || '自定义飞行器'} - ${personality}飞手 | SkiHive`,
      query: `task=${task?.name || '未知任务'}&score=${totalScore}`
    }
  }
})