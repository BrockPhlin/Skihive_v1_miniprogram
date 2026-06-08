// event-card 组件
Component({
  properties: {
    // 事件卡片数据
    event: {
      type: Object,
      value: null
    },
    // 是否显示
    visible: {
      type: Boolean,
      value: false
    },
    // 当前电量
    battery: {
      type: Number,
      value: 100
    },
    // 事件进度
    eventIndex: {
      type: Number,
      value: 1
    },
    // 总事件数
    totalEvents: {
      type: Number,
      value: 5
    }
  },

  data: {
    customInput: '',
    eventTypeInfo: null,
    showCustomInput: false
  },

  observers: {
    'event': function(event) {
      if (event) {
        const typeInfo = {
          weather: { name: '天气', icon: '🌤', color: '#4A90D9' },
          obstacle: { name: '障碍', icon: '⚠️', color: '#E6A23C' },
          emergency: { name: '紧急', icon: '🚨', color: '#F56C6C' },
          opportunity: { name: '机会', icon: '✨', color: '#67C23A' }
        }
        this.setData({ eventTypeInfo: typeInfo[event.type] || { name: '事件', icon: '📌', color: '#909399' } })
      }
    }
  },

  methods: {
    // 选择预设选项
    onChoiceSelect(e) {
      const choiceId = e.currentTarget.dataset.id
      this.triggerEvent('choice', { choiceId, customText: null })
    },

    // 切换到自定义输入模式
    onCustomToggle() {
      this.setData({ showCustomInput: true })
    },

    // 取消自定义输入
    onCustomCancel() {
      this.setData({ showCustomInput: false, customInput: '' })
    },

    // 确认自定义选项
    onCustomConfirm() {
      const customText = this.data.customInput.trim()
      if (!customText) {
        wx.showToast({ title: '请输入你的想法', icon: 'none' })
        return
      }
      this.triggerEvent('choice', { choiceId: 'custom', customText })
      this.setData({ showCustomInput: false, customInput: '' })
    },

    // 监听自定义输入
    onCustomInput(e) {
      this.setData({ customInput: e.detail.value })
    }
  }
})