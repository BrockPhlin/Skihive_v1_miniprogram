// 飞手人格计算（统一逻辑）
const PERSONALITIES = {
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

function computePersonality(stats, taskName) {
  if (!stats) return '脑洞怪 WTF-AIR'

  const isNightTask = taskName?.includes('夜') || taskName?.includes('夜间')

  if (isNightTask && stats.fun > 60) return '追光狂 LIGHT-HUNT'
  if (taskName?.includes('外卖') || taskName?.includes('奶茶') || taskName?.includes('物资')) {
    if (stats.stability > 60) return '送达王 DROP-MAX'
  }
  if (stats.fun > 70) return '戏精机长 DRAMA-PILOT'
  if (stats.stability > 70 && stats.duration > 60) return '稳如老狗 SAFE-DOG'
  if (stats.fun > 50 && isNightTask) return '夜游人 NIGHT-GOGO'
  if (taskName?.includes('猫')) return '猫派救援师 CAT-SAVER'
  if (stats.fun > 80) return '乱飞艺术家 CHAOS-AIR'
  if (taskName?.includes('浪漫') || taskName?.includes('告白')) return '浪漫病 LOVE-DROP'
  if (stats.duration < 40 && stats.fun > 50) return '赌命飞手 RISK-ONE'
  if (stats.duration > 80) return '收藏癖 SHOT-HOARDER'

  return '脑洞怪 WTF-AIR'
}

// === 以下 3 个函数为 result.js 补的 stub ===
// （多维飞行人格：基于 4 维评分算出更细分的人格标签）

/**
 * 基于 4 维飞行评分（勇敢/创意/稳定/趣味）算出多维人格对象
 * @param {object} flightScores - {braveIndex, creativeIndex, stableIndex, funIndex}
 * @returns {object|null} 人格描述对象
 */
function computeFlightPersonality(flightScores) {
  if (!flightScores) return null
  const { braveIndex = 0, creativeIndex = 0, stableIndex = 0, funIndex = 0 } = flightScores
  const total = braveIndex + creativeIndex + stableIndex + funIndex
  if (total === 0) return null

  // 找出最高维
  const dims = [
    { key: 'brave', value: braveIndex, label: '勇敢' },
    { key: 'creative', value: creativeIndex, label: '创意' },
    { key: 'stable', value: stableIndex, label: '稳定' },
    { key: 'fun', value: funIndex, label: '趣味' }
  ].sort((a, b) => b.value - a.value)

  return {
    primary: dims[0],
    secondary: dims[1],
    balance: dims
  }
}

/**
 * 把多维人格对象格式化为展示文本
 * @param {object} flightPersonality - computeFlightPersonality 返回的对象
 * @returns {string} 可直接渲染的展示文本
 */
function formatFlightPersonalityDisplay(flightPersonality) {
  if (!flightPersonality || !flightPersonality.primary) return ''
  const { primary, secondary } = flightPersonality
  return `主属性：${primary.label} ${primary.value} · 次属性：${secondary.label} ${secondary.value}`
}

/**
 * 获取 4 个评分维度的元数据（label/description/icon）
 * @returns {Array} 维度数组
 */
function getScoreDimensions() {
  return [
    { key: 'braveIndex', label: '勇敢', description: '高空/高速等冒险倾向' },
    { key: 'creativeIndex', label: '创意', description: '独特/惊艳的选择' },
    { key: 'stableIndex', label: '稳定', description: '安全/稳妥的选择' },
    { key: 'funIndex', label: '趣味', description: '娱乐/搞笑的选择' }
  ]
}

module.exports = {
  PERSONALITIES,
  computePersonality,
  computeFlightPersonality,
  formatFlightPersonalityDisplay,
  getScoreDimensions
}
