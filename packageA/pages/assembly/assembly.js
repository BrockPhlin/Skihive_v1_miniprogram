// assembly.js — 创作工作台
const app = getApp()

// 功能模块
const MODULES = [
  { id: 'bigBattery', name: '大电池', icon: '🔋', stats: { duration: 30, stability: 5, fun: 10 }, description: '容量大幅提升，续航时间延长50%，适合长途任务', tip: '配送/运输任务必选，避免中途没电' },
  { id: 'nightCamera', name: '夜拍相机', icon: '📷', stats: { duration: -5, stability: 0, fun: 25 }, description: '配备星光级传感器，弱光环境下也能拍出清晰画面', tip: '夜景拍摄、跟拍必备，画质提升显著' },
  { id: 'gimbal', name: '云台稳定器', icon: '🎯', stats: { duration: -10, stability: 30, fun: 15 }, description: '三轴机械云台，飞行中画面始终平稳不抖动', tip: '视频拍摄首选，画面质量提升利器' },
  { id: 'cargo', name: '小货仓', icon: '📦', stats: { duration: -15, stability: 10, fun: 20 }, description: '可承载500g物品，配备减震托盘保护货物安全', tip: '外卖/快递任务核心装备，增加收益' },
  { id: 'searchLight', name: '探照灯', icon: '🔦', stats: { duration: -10, stability: 5, fun: 20 }, description: '1000流明亮度，照亮50米范围，配备强弱两档', tip: '夜间任务、搜救任务、探索任务首选' },
  { id: 'grabClaw', name: '抓取爪', icon: '🦷', stats: { duration: -15, stability: -5, fun: 30 }, description: '液压驱动的机械爪，可抓取不超过300g的物品', tip: '救援任务、特殊投递任务关键装备' },
  { id: 'speaker', name: '扬声器', icon: '🔊', stats: { duration: -5, stability: 0, fun: 25 }, description: '50W大功率音箱，支持语音播报和音乐播放', tip: '娱乐表演、告白场景必备道具' },
  { id: 'moodLight', name: '情绪灯带', icon: '💡', stats: { duration: -5, stability: 5, fun: 30 }, description: 'RGB氛围灯带，可变换1600万种颜色，支持音乐律动', tip: '浪漫场景、表演场景氛围神器' },
  { id: 'thermalCam', name: '热成像仪', icon: '🌡️', stats: { duration: -12, stability: 0, fun: 15 }, description: '红外热成像摄像头，可探测生命体征和温度异常', tip: '搜救任务、夜间巡逻专业设备' },
  { id: 'radar', name: '避障雷达', icon: '📡', stats: { duration: -8, stability: 20, fun: 5 }, description: '360度全方位探测，提前感知障碍物并自动绕行', tip: '复杂环境飞行安全保证，新手推荐' },
  { id: 'relayStation', name: '信号中继', icon: '📶', stats: { duration: -10, stability: 15, fun: 10 }, description: '增强信号覆盖，穿墙能力提升300%，超远距离控制', tip: '超视距任务、信号干扰环境必备' },
  { id: 'homingBeacon', name: '归航信标', icon: '🏠', stats: { duration: -5, stability: 25, fun: 5 }, description: '精准定位系统，一键自动返航，防止飞行器丢失', tip: '新手必备、安全保障、低电量时自动返航' }
]

// 母体（增加 stats）
const BODIES = [
  { id: 'airLite', name: 'Air Lite', icon: '🛸', stats: { duration: 10, stability: 5, fun: 5 }, description: '轻量化设计，机身仅重250g，续航能力出色', tip: '适合日常任务，新手友好' },
  { id: 'speedBee', name: 'Speed Bee', icon: '🐝', stats: { duration: -10, stability: -5, fun: 15 }, description: '竞速型飞行器，最高时速可达80km/h，灵活度极高', tip: '追求速度和刺激的用户首选' },
  { id: 'stablePro', name: 'Stable Pro', icon: '🛡️', stats: { duration: 5, stability: 15, fun: 0 }, description: '专业级稳定架构，抗风能力7级，稳定性拉满', tip: '恶劣天气、追求稳定的任务首选' },
  { id: 'stealthX', name: 'Stealth X', icon: '🦇', stats: { duration: 0, stability: 10, fun: 10 }, description: '静音设计，噪声低于45分贝，适合安静环境', tip: '夜间巡逻、博物馆等安静场所' },
  { id: 'megaCarrier', name: 'Mega Carrier', icon: '🚁', stats: { duration: -15, stability: 5, fun: 5 }, description: '大型运输机型，载重能力2kg，空间宽敞', tip: '大型物资运输、货运任务' }
]

// 外壳造型（增加 stats）
const SHELLS = [
  { id: 'round', name: '圆润治愈壳', icon: '🫧', stats: { duration: 0, stability: 5, fun: 10 }, description: '流线型圆润设计，触感细腻，萌系风格', tip: '适合温柔、治愈系任务' },
  { id: 'speed', name: '流线速度壳', icon: '⚡', stats: { duration: -5, stability: 5, fun: 10 }, description: '风洞测试优化，风阻降低40%，速度快', tip: '高速任务、竞赛首选' },
  { id: 'tech', name: '城市科技壳', icon: '🏙️', stats: { duration: 0, stability: 5, fun: 5 }, description: '赛博朋克风格，霓虹灯效，未来感十足', tip: '城市任务、科技展' },
  { id: 'bio', name: '仿生生物壳', icon: '🦋', stats: { duration: -5, stability: 0, fun: 15 }, description: '模拟生物形态，自然伪装，惊奇效果', tip: '野外拍摄、观察任务' },
  { id: 'stealth', name: '隐形外壳', icon: '👻', stats: { duration: -3, stability: 8, fun: 5 }, description: '哑光材质，减少雷达反射，低调隐蔽', tip: '秘密任务、巡逻任务' },
  { id: 'armor', name: '防护装甲', icon: '🛡️', stats: { duration: -8, stability: 15, fun: 0 }, description: '钛合金加强结构，抗冲击能力强', tip: '恶劣环境、危险任务' }
]

// 配色（不影响评分）
const COLORS = [
  { id: 'cityWhite', name: '城市白', color: '#f5f5f5', description: '简洁干净，城市气息' },
  { id: 'nightBlack', name: '夜行黑', color: '#1a1a1a', description: '神秘酷炫，夜间飞行不易被发现' },
  { id: 'sageGreen', name: '鼠尾草绿', color: '#9dc183', description: '自然柔和，亲切感' },
  { id: 'desertOrange', name: '沙漠橙', color: '#e8a87c', description: '温暖活力，个性张扬' },
  { id: 'glacierBlue', name: '冰川蓝', color: '#a8d8ea', description: '清爽科技，冷静高效' },
  { id: 'sunsetPink', name: '落日粉', color: '#ffb7c5', description: '浪漫温馨，适合告白任务' },
  { id: 'midnightPurple', name: '午夜紫', color: '#4a3f6b', description: '神秘高贵，适合夜间任务' }
]

// 点缀件（增加 stats）
const ACCESSORIES = [
  { id: 'lightStrip', name: '灯带', icon: '💫', stats: { duration: -5, stability: 0, fun: 15 }, description: 'RGB灯带，飞行中留下光轨，炫酷吸睛', tip: '表演、告白氛围加成' },
  { id: 'charm', name: '小挂件', icon: '🎀', stats: { duration: 0, stability: 0, fun: 10 }, description: '可爱装饰，个性展示，回头率高', tip: '增加趣味性，展现个性' },
  { id: 'guard', name: '护圈', icon: '⭕', stats: { duration: 0, stability: 10, fun: 0 }, description: '环形保护架，防止碰撞损伤', tip: '新手保护、复杂环境' },
  { id: 'wing', name: '尾翼', icon: '✈️', stats: { duration: -5, stability: 5, fun: 10 }, description: '空气动力学尾翼，提升飞行稳定性', tip: '高速飞行稳定加成' },
  { id: 'antenna', name: '高增益天线', icon: '📶', stats: { duration: -3, stability: 8, fun: 5 }, description: '增强信号接收，超远距离控制', tip: '远距离任务信号保障' },
  { id: 'mirror', name: '镜面贴片', icon: '🪞', stats: { duration: 0, stability: 0, fun: 15 }, description: '镜面反光效果，闪耀全场', tip: '表演、吸引眼球' }
]

// 即时反馈词库
const FEEDBACKS = {
  bigBattery: '续航给力，安全感满满',
  nightCamera: '今晚很适合出片',
  gimbal: '稳得一批，画面不抖',
  cargo: '这台一看就很能送',
  searchLight: '夜里会很有安全感',
  grabClaw: '抓取小能手上线',
  speaker: '能唱歌的飞行器诶',
  moodLight: '这台开始有点招人喜欢了',
  round: '圆润圆润，看着就治愈',
  speed: '看着就很想飞快一点',
  tech: '科技感拉满，很酷',
  bio: '仿生设计，有点可爱',
  cityWhite: '城市白，很干净',
  nightBlack: '夜行黑，神秘感十足',
  sageGreen: '有点温柔，好看',
  desertOrange: '沙漠橙，暖洋洋的',
  glacierBlue: '冰川蓝，清爽',
  lightStrip: '灯带一装，炫酷加倍',
  charm: '小挂件可可爱爱',
  guard: '护圈加装，安全放心',
  wing: '尾翼有点帅'
}

// 组装结果图片映射（24个素材编号 + 旧版13个图片）
const ASSEMBLY_IMAGES = {
  // === 都市潮改系列（编号1）===
  // 1_1: 科技感家用航拍风，白+黑+透明，半透明保护圈带淡蓝色灯光
  '1_1': 'https://link.jiyiho.cn/orfile/view.php/81bc1ecc1b0285ceb324341263403f06.png',
  // 1_2: 硬核竞技风，黑白撞色对比，蛋形流线机身，透明座舱
  '1_2': 'https://link.jiyiho.cn/orfile/view.php/f6dac7380327f245144d4101d5ecf9f4.png',
  // 1_3: 未来机甲风，白+黑+浅黄，多边形棱角机身，几何镂空保护圈
  '1_3': 'https://link.jiyiho.cn/orfile/view.php/b984fbd2c3d1ba51af66a0887d125960.png',
  // 1_4: 轻奢商务风，浅白+黑柔和撞色，圆润机身，全包保护圈
  '1_4': 'https://link.jiyiho.cn/orfile/view.php/af2c7429adf6ae9d16f12a352b795274.png',

  // === 仿生流线系列（编号2）===
  // 2_1: 几何机甲风，白+深灰+橙的低饱和撞色，多边形棱角机身
  '2_1': 'https://link.jiyiho.cn/orfile/view.php/e85cd71ad2075c8bec37873114eee06d.png',
  // 2_2: 复古运动风，白+黑+橙撞色，蛋形圆润机身，纹理化设计
  '2_2': 'https://link.jiyiho.cn/orfile/view.php/c4a647ab42f1c1561566d5b1e5be5b04.png',
  // 2_3: 极简商务风，低饱和灰调+暖橙细节，多边形机身线条干净
  '2_3': 'https://link.jiyiho.cn/orfile/view.php/c20491075bb2eb404fe5cf0e41081a06.png',
  // 2_4: 极简清新风，白+深灰+浅橙的柔和配色，俯视对称设计
  '2_4': 'https://link.jiyiho.cn/orfile/view.php/060f590d0b26b9fbbd83ba068de059ab.png',

  // === 黑银赛博系列（编号3）===
  // 3_1: 硬核科技风，白+银+透明的清新色调，流线型蛋形机身
  '3_1': 'https://link.jiyiho.cn/orfile/view.php/8818c697728c4f9a0d3638989be35fc8.png',
  // 3_2: 专业工业风，灰调为主+橙色线条提亮，多摄像头模块设计
  '3_2': 'https://link.jiyiho.cn/orfile/view.php/116d871216f4ad0efa4bde643b9b231d.png',
  // 3_3: 硬核工业风，白+银+透明工业风，外露机械结构
  '3_3': 'https://link.jiyiho.cn/orfile/view.php/4d43275945039a8ee384154c752809ba.png',
  // 3_4: 运动潮流风，黑白撞色对比，多边形棱角机身
  '3_4': 'https://link.jiyiho.cn/orfile/view.php/efb01e85324dceb91e1371914df400dd.png',

  // === 极简白银系列（编号4）===
  // 4_1: 硬核科技风，白+黑+银冷色调，流线型蛋形机身，外露金属结构
  '4_1': 'https://link.jiyiho.cn/orfile/view.php/692876def797037db058b74eb8bf3622.png',
  // 4_2: 轻奢商务风，浅白+黑的柔和撞色，圆润机身+全包保护圈
  '4_2': 'https://link.jiyiho.cn/orfile/view.php/817899831e24aad8c03e5f9630a42a40.png',
  // 4_3: 未来机甲风，白+黑+浅黄低饱和配色，多边形棱角机身
  '4_3': 'https://link.jiyiho.cn/orfile/view.php/d5aa742a59b7ed726af3daf186ee1f3f.png',
  // 4_4: 简约清新风，白+黑极简配色，X型交叉机臂
  '4_4': 'https://link.jiyiho.cn/orfile/view.php/9bace3f30d88d80474eacc52e75a497f.png',

  // === 轻量社交系列（编号5）===
  // 5_1: 简约飞船风，白+灰+黑+红撞色，四轴带全包桨保护圈
  '5_1': 'https://link.jiyiho.cn/orfile/view.php/8db0c2f22264a3bfe1c24d3ecf1ee92c.png',
  // 5_2: 复古玩具风，白+深灰+橙的低饱和暖色调，复古玩具风
  '5_2': 'https://link.jiyiho.cn/orfile/view.php/8ea0d1b441915f6bd4e0a8a1ef061d7a.png',
  // 5_3: 极简科技风，白+银+透明清新色调，蛋形圆润机身
  '5_3': 'https://link.jiyiho.cn/orfile/view.php/0ac2e6e0d4505b603bb11f63de954c3c.png',
  // 5_4: 简约家用风，白+黑极简配色，圆润机身
  '5_4': 'https://link.jiyiho.cn/orfile/view.php/d041e124d2afa1048b6d8320d380834b.png',

  // === 白底系列（编号6）===
  // 6_1: 科技感家用航拍风，白+黑+透明，半透明保护圈
  '6_1': 'https://link.jiyiho.cn/orfile/view.php/b7d483bd1d0ac0b7de15e6a7b206c1c4.png',
  // 6_2: 硬核竞技风，黑白撞色，蛋形流线机身
  '6_2': 'https://link.jiyiho.cn/orfile/view.php/47443591a63912e5b4556082b84d5cf3.png',
  // 6_3: 未来机甲风，白+黑+浅黄，多边形棱角机身
  '6_3': 'https://link.jiyiho.cn/orfile/view.php/ad69d16275c70d1c9c2e3abfc8f049a5.png',
  // 6_4: 轻奢商务风，浅白+黑柔和撞色，圆润机身
  '6_4': 'https://link.jiyiho.cn/orfile/view.php/adcb1c76da57e615ad1a8d44f618ee81.png',

  // === 旧版图片（保留）===
  '都市潮改': 'https://link.jiyiho.cn/orfile/view.php/1da5a5c79936384e0f02df2167621766.png',
  '都市潮改运动': 'https://link.jiyiho.cn/orfile/view.php/8ed3033110cda6d693e6b7d0e7cb4371.png',
  '都市潮改运动白底': 'https://link.jiyiho.cn/orfile/view.php/3a1208898f6373b51356921571277a1f.png',
  '仿生流线海洋': 'https://link.jiyiho.cn/orfile/view.php/99ad0b958f0c6ab5c6dedcca60f83adc.png',
  '仿生流线海洋白底': 'https://link.jiyiho.cn/orfile/view.php/71ba2cf5b7fd5fc2917aa0f4159cf148.png',
  '仿生流线': 'https://link.jiyiho.cn/orfile/view.php/d79483c0a50527f910e5baa9bfbb7051.png',
  '黑银赛博夜航1': 'https://link.jiyiho.cn/orfile/view.php/f8c44df0ddfe153a4fb29eb0192e9519.png',
  '黑银赛博夜航': 'https://link.jiyiho.cn/orfile/view.php/81e15c08e718749be5ff772ab429f8d7.png',
  '黑银赛博夜航白底': 'https://link.jiyiho.cn/orfile/view.php/b83fe5788e0e96bdc57bf999eac3b3a8.png',
  '极简白银未来消费款': 'https://link.jiyiho.cn/orfile/view.php/75b51a55f448abb0f79567d575e79f14.png',
  '极简白银未来款': 'https://link.jiyiho.cn/orfile/view.php/c19d8221783273b69b2c448a642bb0b7.png',
  '轻量社交航拍款': 'https://link.jiyiho.cn/orfile/view.php/0cadebd13ce04dc39dfcfd6914faea44.png',
  '轻量社交随身款': 'https://link.jiyiho.cn/orfile/view.php/dd0f1c7985ee95c2c31b9811d276cdae.png',

  // 默认白底
  'default': 'https://link.jiyiho.cn/orfile/view.php/ccbf67b5f200001fd4d71a8f8a2cbe5d.png'
}

// 根据配置获取对应图片（支持24个编号和旧版中文名）
function getAssemblyImage(bodyId, shellId, colorId) {
  // 先尝试直接用旧版中文名匹配
  if (bodyId && ASSEMBLY_IMAGES[bodyId]) {
    return ASSEMBLY_IMAGES[bodyId]
  }
  if (shellId && ASSEMBLY_IMAGES[shellId]) {
    return ASSEMBLY_IMAGES[shellId]
  }

  // 外壳风格到系列的映射
  const shellSeriesMap = {
    tech: '1',    // 都市潮改
    bio: '2',     // 仿生流线
    stealth: '3', // 黑银赛博
    armor: '3',   // 黑银赛博
    round: '4',   // 极简白银
    speed: '5'    // 轻量社交
  }

  // 每个系列内4个变体对应的颜色组合
  const seriesVariants = {
    '1': ['cityWhite', 'nightBlack', 'glacierBlue', 'sageGreen'],           // 都市潮改
    '2': ['sageGreen', 'desertOrange', 'sunsetPink', 'glacierBlue'],        // 仿生流线
    '3': ['nightBlack', 'midnightPurple', 'glacierBlue', 'cityWhite'],      // 黑银赛博
    '4': ['glacierBlue', 'sageGreen', 'sunsetPink', 'cityWhite'],           // 极简白银
    '5': ['desertOrange', 'sunsetPink', 'glacierBlue', 'cityWhite'],        // 轻量社交
    '6': ['cityWhite', 'sageGreen', 'desertOrange', 'nightBlack']           // 白底
  }

  const series = shellSeriesMap[shellId] || '6'
  const colorOptions = seriesVariants[series] || seriesVariants['6']

  // 根据颜色找对应的变体编号
  const variantIndex = colorOptions.indexOf(colorId)
  let variantNum
  if (variantIndex >= 0) {
    variantNum = variantIndex + 1
  } else {
    // 颜色不在列表中，用第一个变体
    variantNum = 1
  }

  const imageKey = `${series}_${variantNum}`
  return ASSEMBLY_IMAGES[imageKey] || ASSEMBLY_IMAGES['default']
}

// 计算属性值（考虑所有选中组件，颜色不影响评分）
function computeStats(selectedModules, bodyId, shellId, colorId, accessoryId) {
  const body = BODIES.find(b => b.id === bodyId)
  const shell = SHELLS.find(s => s.id === shellId)
  const accessory = ACCESSORIES.find(a => a.id === accessoryId)

  let duration = 50
  let stability = 50
  let fun = 50

  // 多选模块加成（累加所有选中模块）
  if (selectedModules && selectedModules.length > 0) {
    selectedModules.forEach(moduleId => {
      const module = MODULES.find(m => m.id === moduleId)
      if (module) {
        duration += module.stats.duration
        stability += module.stats.stability
        fun += module.stats.fun
      }
    })
  }

  // 母体加成
  if (body) {
    duration += body.stats.duration
    stability += body.stats.stability
    fun += body.stats.fun
  }

  // 外壳加成
  if (shell) {
    duration += shell.stats.duration
    stability += shell.stats.stability
    fun += shell.stats.fun
  }

  // 点缀件加成
  if (accessory) {
    duration += accessory.stats.duration
    stability += accessory.stats.stability
    fun += accessory.stats.fun
  }

  // 限制范围
  duration = Math.max(0, Math.min(100, duration))
  stability = Math.max(0, Math.min(100, stability))
  fun = Math.max(0, Math.min(100, fun))

  return { duration, stability, fun }
}

// 计算匹配度（考虑所有组件与任务的匹配，颜色不影响）
function computeMatch(taskName, selectedModules, bodyId, shellId, colorId, accessoryId) {
  const task = app.globalData.currentTask
  if (!task) return 50

  let match = 50

  // 夜间任务
  const nightTasks = ['蓝眼泪海边夜拍', '博物馆夜间秘密导览', '未来城市低空巡游']
  // 配送任务
  const deliveryTasks = ['暴雨校园奶茶速递', '宿舍深夜外卖救援', '山谷露营物资空投']
  // 拍摄任务
  const photoTasks = ['樱花大道毕业跟拍', '天台告白玫瑰空投', '音乐节空中运镜']

  // 多选模块匹配
  if (selectedModules && selectedModules.length > 0) {
    if (nightTasks.includes(task.name)) {
      if (selectedModules.includes('nightCamera') || selectedModules.includes('searchLight') || selectedModules.includes('moodLight')) match += 20
    }
    if (deliveryTasks.includes(task.name)) {
      if (selectedModules.includes('cargo') || selectedModules.includes('bigBattery')) match += 20
    }
    if (photoTasks.includes(task.name)) {
      if (selectedModules.includes('nightCamera') || selectedModules.includes('gimbal')) match += 20
    }
    // 猫救援任务 - 抓取爪加成
    if (task.name.includes('猫咪营救') && selectedModules.includes('grabClaw')) {
      match += 25
    }
    // 告白任务 - 浪漫加成
    if (task.name.includes('告白') && (selectedModules.includes('speaker') || selectedModules.includes('moodLight'))) {
      match += 15
    }
  }

  // 母体加成
  if (task.name.includes('配送') && bodyId === 'airLite') match += 5
  // 外壳加成
  if (deliveryTasks.includes(task.name) && shellId === 'speed') match += 5
  if (photoTasks.includes(task.name) && shellId === 'bio') match += 10

  return Math.min(100, match)
}

Page({
  data: {
    // 固定数据
    modules: MODULES,
    bodies: BODIES,
    shells: SHELLS,
    colors: COLORS,
    accessories: ACCESSORIES,

    // 当前选择（模块支持多选，默认都不选中）
    selectedModules: [],
    selectedModuleMap: {}, // 用于 WXML 快速判断
    selectedBody: null,
    selectedShell: null,
    selectedColor: null,
    selectedAccessory: null,

    // 预览区辅助数据
    selectedBodyIcon: '🛸',
    selectedModulesDisplay: [],
    selectedShellIcon: '',
    selectedShellName: '',
    selectedAccessoryIcon: '',
    selectedColorHex: '',

    // 即时反馈
    feedback: '选择一个模块开始创作你的飞行器',
    stats: { duration: 50, stability: 50, fun: 50 },
    match: 50,

    // 任务信息
    task: null
  },

  onLoad() {
    const task = app.globalData.currentTask
    this.setData({ task })
    this.updatePreview()
    this.updateStats()
  },

  // 更新预览区
  updatePreview() {
    const { selectedModules, selectedBody, selectedShell, selectedColor, selectedAccessory } = this.data

    const body = BODIES.find(b => b.id === selectedBody)
    const shells = SHELLS.find(s => s.id === selectedShell)
    const color = COLORS.find(c => c.id === selectedColor)
    const accessory = ACCESSORIES.find(a => a.id === selectedAccessory)

    // 构建模块显示列表（多选）
    const modulesDisplay = selectedModules.map(moduleId => {
      const module = MODULES.find(m => m.id === moduleId)
      return module ? { icon: module.icon, name: module.name } : null
    }).filter(Boolean)

    // 根据配置获取组装结果图片
    const assemblyImageUrl = getAssemblyImage(selectedBody, selectedShell, selectedColor)

    this.setData({
      selectedBodyIcon: body?.icon || '🛸',
      selectedModulesDisplay: modulesDisplay,
      selectedShellIcon: shells?.icon || '',
      selectedShellName: shells?.name || '',
      selectedAccessoryIcon: accessory?.icon || '',
      selectedColorHex: color?.color || '#f5f5f5',
      assemblyImageUrl
    })
  },

  // 选择功能模块（多选）
  selectModule(e) {
    const moduleId = e.currentTarget.dataset.id
    const { selectedModules, selectedModuleMap } = this.data

    let newSelectedModules, newModuleMap
    if (selectedModules.includes(moduleId)) {
      newSelectedModules = selectedModules.filter(id => id !== moduleId)
      newModuleMap = { ...selectedModuleMap }
      delete newModuleMap[moduleId]
    } else {
      newSelectedModules = [...selectedModules, moduleId]
      newModuleMap = { ...selectedModuleMap, [moduleId]: true }
    }

    const module = MODULES.find(m => m.id === moduleId)
    const feedback = module ? `${module.name}：${module.description}（${module.tip}）` : '加了这个模块'

    this.setData({
      selectedModules: newSelectedModules,
      selectedModuleMap: newModuleMap,
      feedback
    })
    this.updatePreview()
    this.updateStats()
  },

  // 选择母体
  selectBody(e) {
    const bodyId = e.currentTarget.dataset.id
    const body = BODIES.find(b => b.id === bodyId)
    const feedback = body ? `${body.name}：${body.description}（${body.tip}）` : `母体选择`
    this.setData({
      selectedBody: bodyId,
      feedback
    })
    this.updatePreview()
    this.updateStats()
  },

  // 选择外壳
  selectShell(e) {
    const shellId = e.currentTarget.dataset.id
    const shell = SHELLS.find(s => s.id === shellId)
    const feedback = shell ? `${shell.name}：${shell.description}（${shell.tip}）` : '外壳选择'
    this.setData({
      selectedShell: shellId,
      feedback
    })
    this.updatePreview()
    this.updateStats()
  },

  // 选择配色
  selectColor(e) {
    const colorId = e.currentTarget.dataset.id
    const color = COLORS.find(c => c.id === colorId)
    const feedback = color ? `${color.name}：${color.description}` : '配色选择'
    this.setData({
      selectedColor: colorId,
      feedback
    })
    this.updatePreview()
    this.updateStats()
  },

  // 选择点缀件
  selectAccessory(e) {
    const accId = e.currentTarget.dataset.id
    const accessory = ACCESSORIES.find(a => a.id === accId)
    const feedback = accessory ? `${accessory.name}：${accessory.description}（${accessory.tip}）` : '点缀件选择'
    this.setData({
      selectedAccessory: accId,
      feedback
    })
    this.updatePreview()
    this.updateStats()
  },

  // 更新属性计算（考虑所有组件）
  updateStats() {
    const { selectedModules, selectedBody, selectedShell, selectedColor, selectedAccessory } = this.data
    const stats = computeStats(selectedModules, selectedBody, selectedShell, selectedColor, selectedAccessory)
    const match = computeMatch(
      app.globalData.currentTask?.name,
      selectedModules,
      selectedBody,
      selectedShell,
      selectedColor,
      selectedAccessory
    )

    this.setData({ stats, match })
  },

  // 开始飞行
  startFlying() {
    const { selectedModules, selectedBody, selectedShell, selectedColor, selectedAccessory, stats, assemblyImageUrl } = this.data

    // 校验：至少要选了母体，没选提示一下
    if (!selectedBody) {
      wx.showToast({
        title: '请先选择飞行器母体',
        icon: 'none'
      })
      return
    }

    // 构建模块名称（多选）
    const moduleNames = selectedModules.map(moduleId => {
      const module = MODULES.find(m => m.id === moduleId)
      return module ? module.name : ''
    }).filter(Boolean).join(' + ')

    // 保存飞行配置
    const droneConfig = {
      module: moduleNames || '无',
      body: BODIES.find(b => b.id === selectedBody)?.name || '',
      shell: selectedShell ? SHELLS.find(s => s.id === selectedShell)?.name : '',
      color: COLORS.find(c => c.id === selectedColor)?.name || '',
      accessory: selectedAccessory ? ACCESSORIES.find(a => a.id === selectedAccessory)?.name : '',
      imageUrl: assemblyImageUrl || ''
    }

    // 计算总分
    const totalScore = Math.round((stats.duration + stats.stability + stats.fun) / 3)

    // 同时把 selectedModules 写入 globalData.assemblySelection（flying.js 第 68-75 行要读这个）
    // 注意：必须传数组，flying.js 会调 modules.filter(Boolean)
    app.updateAssemblySelection(selectedModules.slice())

    app.updateCurrentFlight({
      droneConfig,
      stats,
      totalScore,
      match: this.data.match
    })

    // 跳转 flying 页：用 redirectTo 避免页面栈过深，并配 fail 兜底
    wx.redirectTo({
      url: '/packageA/pages/flying/flying',
      success: () => {
        console.log('[assembly] 跳转 flying 成功')
      },
      fail: (err) => {
        console.error('[assembly] 跳转 flying 失败:', err)
        wx.showToast({
          title: '跳转失败：' + (err.errMsg || '未知错误'),
          icon: 'none',
          duration: 3000
        })
        // 兜底：再试 navigateTo
        wx.navigateTo({
          url: '/packageA/pages/flying/flying'
        })
      }
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
