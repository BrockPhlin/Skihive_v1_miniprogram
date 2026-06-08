// task-card.js
const app = getApp()

const TASKS = [
  { id: 1, name: '暴雨校园奶茶速递', image: 'https://cdn.phototourl.com/free/2026-04-27-03f58944-4f0b-460a-badf-b53c79fca63c.jpg' },
  { id: 2, name: '蓝眼泪海边夜拍', image: 'https://cdn.phototourl.com/free/2026-04-27-92056768-6e90-4107-996d-2b9abcdd66cf.jpg' },
  { id: 3, name: '樱花大道毕业跟拍', image: 'https://cdn.phototourl.com/free/2026-04-27-1e9d0613-622d-49aa-921f-3bf2bf2320ba.png' },
  { id: 4, name: '天台告白玫瑰空投', image: 'https://cdn.phototourl.com/free/2026-04-27-ff3ac0ea-0d49-4866-a951-474d467fa2b4.png' },
  { id: 5, name: '音乐节空中运镜', image: 'https://cdn.phototourl.com/free/2026-04-27-fb3825e2-9179-449f-8424-8a0054bdffe7.jpg' },
  { id: 6, name: '宿舍深夜外卖救援', image: 'https://cdn.phototourl.com/free/2026-04-27-d8ad578d-9a24-4468-9071-167ddce425f6.jpg' },
  { id: 7, name: '博物馆夜间秘密导览', image: 'https://cdn.phototourl.com/free/2026-04-27-14f72fb9-6293-4ab2-ab1c-eb1c329ed7cc.png' },
  { id: 8, name: '山谷露营物资空投', image: 'https://cdn.phototourl.com/free/2026-04-27-eb71ba3a-c5f6-4a97-a1dc-8d7b3fb0fc5f.jpg' },
  { id: 9, name: '未来城市低空巡游', image: 'https://cdn.phototourl.com/free/2026-04-27-7f2f0b7a-eeee-4bc8-a266-be8c712c9523.png' },
  { id: 10, name: '屋顶猫咪营救', image: 'https://cdn.phototourl.com/member/2026-04-27-5d37ec09-9bdd-44ca-949f-01b790951137.png' }
]

Page({
  data: {
    tasks: TASKS,
    selectedTask: null
  },

  onShow() {
    const userInfo = app.globalData.userInfo
    if (userInfo && userInfo.nickname) {
      wx.setNavigationBarTitle({
        title: userInfo.nickname
      })
    }
  },

  selectTask(e) {
    const taskId = e.currentTarget.dataset.id
    const task = this.data.tasks.find(t => t.id === taskId)
    this.setData({ selectedTask: task })
  },

  confirmTask() {
    if (!this.data.selectedTask) {
      wx.showToast({
        title: '请先选择一个任务',
        icon: 'none'
      })
      return
    }

    app.updateCurrentTask(this.data.selectedTask)

    wx.navigateTo({
      url: '/packageA/pages/assembly/assembly'
    })
  },

  goBack() {
    wx.navigateBack()
  },

  navigateBack() {
    wx.navigateBack({
      fail: () => {
        wx.reLaunch({ url: '/pages/index/index' })
      }
    })
  }
})
