// story.js
const app = getApp()
const { storage } = require('../../../utils/storage.js')

Page({
  data: {
    // 章节选择模式
    isChapterMode: true,
    progress: 0,

    // 章节数据
    chapters: [],

    // 当前剧情进度
    currentChapterId: null,
    currentChapter: null,
    currentSceneIndex: 0,

    // 当前场景数据
    currentNarration: '',
    displayedNarration: '',
    currentDialogues: [],
    currentOptions: [],

    // 打字机效果
    isTyping: false,
    typingTimer: null,
    fullText: '',
    typingIndex: 0,

    // 选项状态
    showOptions: false,

    // 确认弹窗
    showConfirm: false,
    selectedOption: null,

    // 隐藏结局
    showSecretHint: false,
    secretHint: {
      title: '',
      description: ''
    },

    // 剧情分支记录
    storyPath: [],

    // 隐藏结局解锁状态
    secretUnlocked: {}
  },

  // 章节数据定义
  chapterData: {
    1: {
      id: 1,
      title: '黎明之约',
      description: '你第一次接触无人机飞行，开启这段奇妙的旅程',
      icon: '🌅',
      scenes: [
        {
          narration: '清晨的阳光洒在操作场上，一架崭新的无人机静静地停在那里，等待着它的主人。',
          dialogues: [
            {
              character: '导师',
              characterIcon: '👨‍🏫',
              text: '欢迎来到无人机训练场，新人。今天将是你的第一次飞行。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '老师，我有点紧张...这是我第一次操控无人机。'
            },
            {
              character: '导师',
              characterIcon: '👨‍🏫',
              text: '别担心，无人机就像是你的伙伴，只要你了解它，它就会配合你。先从基础操作开始吧。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '仔细阅读操作手册',
              tag: 'main',
              tagText: '主线',
              resultPreview: '稳扎稳打，了解每一步操作',
              nextScene: 1,
              effect: { patience: +1 }
            },
            {
              id: 'b',
              text: '直接尝试飞行',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '大胆尝试，可能会有意外发现',
              nextScene: 2,
              effect: { courage: +1 }
            }
          ],
          secretHint: {
            title: '细心观察',
            description: '在第一章的第三幕，选择"观察无人机状态"可能触发隐藏剧情'
          }
        },
        {
          narration: '你按照指导认真地检查无人机，了解每一个部件的功能。',
          dialogues: [
            {
              character: '导师',
              characterIcon: '👨‍🏫',
              text: '很好，你展现出了作为飞手最重要的品质——耐心。现在，让我们进行第一次起飞。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '明白了！我会按照您教的方法一步一步来。'
            },
            {
              character: '导师',
              characterIcon: '👨‍🏫',
              text: '起飞后要注意保持平稳，遇到问题不要慌，记住我们学过的应急程序。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '缓慢加速，保持低空飞行',
              tag: 'main',
              tagText: '主线',
              resultPreview: '循序渐进，安全第一',
              nextScene: 3,
              effect: { caution: +1 }
            },
            {
              id: 'b',
              text: '直接拉升到中空',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '挑战自我，但需要更好的平衡感',
              nextScene: 4,
              effect: { confidence: +1 }
            }
          ]
        },
        {
          narration: '无人机平稳地升空，你小心翼翼地操控着，感受着这道新生的羁绊。',
          dialogues: [
            {
              character: '导师',
              characterIcon: '👨‍🏫',
              text: '做得好！你已经掌握了基本的起飞和控制。接下来我们要学习航线规划。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '航线规划？这是什么？'
            },
            {
              character: '导师',
              characterIcon: '👨‍🏫',
              text: '航线规划就是为无人机设定飞行路线，让它能够自主完成飞行任务。这是成为优秀飞手的关键技能。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '认真记录每一个要点',
              tag: 'main',
              tagText: '主线',
              resultPreview: '好记性不如烂笔头',
              nextScene: 5,
              effect: { wisdom: +1 }
            },
            {
              id: 'b',
              text: '询问关于特殊航线的问题',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '深入了解，获得额外知识',
              nextScene: 6,
              effect: { curiosity: +1 }
            }
          ],
          secretHint: {
            title: '探索未知',
            description: '第一章隐藏结局与"特殊航线"有关'
          }
        },
        {
          narration: '完成基础训练后，导师向你介绍了即将到来的任务——夜间货物配送。',
          dialogues: [
            {
              character: '导师',
              characterIcon: '👨‍🏫',
              text: '你已经具备了基础飞行能力，接下来我将交给你第一个真正的任务。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '是什么任务呢？'
            },
            {
              character: '导师',
              characterIcon: '👨‍🏫',
              text: '城市速递任务。你需要操控无人机穿越城市，将包裹安全送达目的地。这个任务会考验你的综合能力。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '接受任务，开启新章节',
              tag: 'main',
              tagText: '主线',
              resultPreview: '迎接新的挑战',
              nextScene: 0,
              nextChapter: 2,
              effect: { determination: +1 }
            }
          ]
        }
      ],
      status: 'new',
      locked: false,
      progress: '0/4'
    },
    2: {
      id: 2,
      title: '夜空挑战',
      description: '夜间飞行任务，面对黑暗中的未知挑战',
      icon: '🌙',
      scenes: [
        {
          narration: '夜幕降临，城市的灯光如同星河。在这个神秘的夜晚，你将执行一次特殊的飞行任务。',
          dialogues: [
            {
              character: '队友',
              characterIcon: '👩‍✈️',
              text: '今晚的任务是穿过城区，将医疗物资紧急送往医院。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '夜间飞行...我还没有经验，会不会有问题？'
            },
            {
              character: '队友',
              characterIcon: '👩‍✈️',
              text: '别担心，我会通过通讯频道全程引导你。你只需要专注于操控。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '打开无人机所有灯光',
              tag: 'main',
              tagText: '主线',
              resultPreview: '确保良好的视线，减少碰撞风险',
              nextScene: 1,
              effect: { caution: +1 }
            },
            {
              id: 'b',
              text: '只保留基本导航灯',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '降低可见度，但节省电量',
              nextScene: 2,
              effect: { efficiency: +1 }
            },
            {
              id: 'c',
              text: '关闭所有灯光，依靠仪表飞行',
              tag: 'secret',
              tagText: '隐藏',
              resultPreview: '极高难度，但可能发现城市的另一面...',
              nextScene: 'secret_1',
              effect: { intuition: +1 },
              secretTrigger: true
            }
          ]
        },
        {
          narration: '无人机升空，你按照队友的引导穿越城市的夜空。高楼大厦的灯光从身边掠过，如同流星。',
          dialogues: [
            {
              character: '队友',
              characterIcon: '👩‍✈️',
              text: '前方就是第一段路程，注意保持高度，避开那座塔吊。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '看到了！我会小心的。'
            },
            {
              character: '队友',
              characterIcon: '👩‍✈️',
              text: '很好，你的飞行姿态很稳。现在进入第二阶段，我们要穿过一片灯光较暗的区域。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '降低速度，仔细观察',
              tag: 'main',
              tagText: '主线',
              resultPreview: '安全第一，谨慎通过',
              nextScene: 3,
              effect: { patience: +1 }
            },
            {
              id: 'b',
              text: '保持速度，相信训练',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '信心十足，但需要快速反应',
              nextScene: 4,
              effect: { confidence: +1 }
            }
          ],
          secretHint: {
            title: '黑暗中的微光',
            description: '第二章的隐藏结局与"信任"有关'
          }
        },
        {
          narration: '任务顺利完成，医疗物资准时送达医院。你成功地完成了第一次夜间飞行任务。',
          dialogues: [
            {
              character: '队友',
              characterIcon: '👩‍✈️',
              text: '干得漂亮！这次任务你表现得非常出色。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '谢谢您的引导，没有您的帮助我不可能完成。'
            },
            {
              character: '队友',
              characterIcon: '👩‍✈️',
              text: '这只是开始。接下来还有更多的挑战在等着你，城市速递任务将是你的下一个目标。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '继续下一个任务',
              tag: 'main',
              tagText: '主线',
              resultPreview: '迎接新的挑战',
              nextScene: 0,
              nextChapter: 3,
              effect: { courage: +1 }
            }
          ]
        }
      ],
      status: 'locked',
      locked: true,
      progress: '0/3'
    },
    3: {
      id: 3,
      title: '城市速递',
      description: '配送任务剧情，穿梭于城市之间',
      icon: '🏙️',
      scenes: [
        {
          narration: '城市的繁华街道上，无人机群穿梭其间。你接到了一个重要的配送任务。',
          dialogues: [
            {
              character: '调度员',
              characterIcon: '📡',
              text: '新人，你今天的任务是穿越半个城区，配送一件重要包裹。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '半个城区？这看起来很有挑战性。'
            },
            {
              character: '调度员',
              characterIcon: '📡',
              text: '没错，但这也是提升你技能的好机会。记住，时间就是生命，效率就是使命。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '规划最短路线',
              tag: 'main',
              tagText: '主线',
              resultPreview: '效率优先，直达目标',
              nextScene: 1,
              effect: { efficiency: +1 }
            },
            {
              id: 'b',
              text: '选择最安全路线',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '安全第一，避开风险区域',
              nextScene: 2,
              effect: { caution: +1 }
            }
          ]
        },
        {
          narration: '你选择了最短路线，开始了紧张刺激的配送之旅。',
          dialogues: [
            {
              character: '你',
              characterIcon: '🧑',
              text: '进入高楼区域了，这里气流很乱...'
            },
            {
              character: '调度员',
              characterIcon: '📡',
              text: '注意调整飞行高度，绕过那片施工区域。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '降低高度躲避',
              tag: 'main',
              tagText: '主线',
              resultPreview: '谨慎操作，安全通过',
              nextScene: 3,
              effect: { adaptability: +1 }
            },
            {
              id: 'b',
              text: '拉升高度绕行',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '大胆决策，节省时间',
              nextScene: 4,
              effect: { creativity: +1 }
            }
          ],
          secretHint: {
            title: '意外相遇',
            description: '第三章隐藏结局与城市中的某个神秘人物有关'
          }
        },
        {
          narration: '任务完成，你获得了宝贵的城市飞行经验。',
          dialogues: [
            {
              character: '调度员',
              characterIcon: '📡',
              text: '很好，你的表现超出预期。下一个任务是风暴任务，那将是真正的考验。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '准备迎接风暴挑战',
              tag: 'main',
              tagText: '主线',
              resultPreview: '勇往直前',
              nextScene: 0,
              nextChapter: 4,
              effect: { determination: +1 }
            }
          ]
        }
      ],
      status: 'locked',
      locked: true,
      progress: '0/3'
    },
    4: {
      id: 4,
      title: '风暴来临',
      description: '紧急情况处理，面对极端天气',
      icon: '⛈️',
      scenes: [
        {
          narration: '天空骤然变暗，暴风雨即将来临。这时你收到了紧急任务——必须立即转移设备。',
          dialogues: [
            {
              character: '指挥员',
              characterIcon: '👨‍🚀',
              text: '紧急召集！暴风雨即将来袭，我们需要立即转移设备到安全地点。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '这种天气条件下飞行？太危险了吧...'
            },
            {
              character: '指挥员',
              characterIcon: '👨‍🚀',
              text: '我知道这很危险，但设备不能落入暴风雨中。你是唯一能完成这个任务的人。'
            }
          ],
          options: [
            {
              id: 'a',
              text: '接受任务，义不容辞',
              tag: 'main',
              tagText: '主线',
              resultPreview: '勇敢担当，使命必达',
              nextScene: 1,
              effect: { courage: +2 }
            },
            {
              id: 'b',
              text: '提出使用备用方案',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '开动脑筋，寻求替代方案',
              nextScene: 2,
              effect: { wisdom: +1 }
            },
            {
              id: 'c',
              text: '请求更多支援',
              tag: 'secret',
              tagText: '隐藏',
              resultPreview: '团队协作，找到最佳方案...',
              nextScene: 'secret_final',
              effect: { leadership: +1 },
              secretTrigger: true
            }
          ]
        },
        {
          narration: '你顶着强风起飞，无人机在狂风中艰难前行。',
          dialogues: [
            {
              character: '你',
              characterIcon: '🧑',
              text: '风速太大了！无人机在偏航...'
            },
            {
              character: '指挥员',
              characterIcon: '👨‍🚀',
              text: '稳住！调低重心，逆风飞行！'
            }
          ],
          options: [
            {
              id: 'a',
              text: '立刻降低高度',
              tag: 'main',
              tagText: '主线',
              resultPreview: '稳妥应对，降低风险',
              nextScene: 3,
              effect: { caution: +1 }
            },
            {
              id: 'b',
              text: '保持高度，修正航向',
              tag: 'branch',
              tagText: '分支',
              resultPreview: '挑战极限，争取时间',
              nextScene: 4,
              effect: { confidence: +1 }
            }
          ],
          secretHint: {
            title: '团队力量',
            description: '第四章隐藏结局与"信任同伴"有关'
          }
        },
        {
          narration: '暴风雨中，你成功地将设备转移到了安全地点。任务完成，你成为了真正的无人机飞行者。',
          dialogues: [
            {
              character: '指挥员',
              characterIcon: '👨‍🚀',
              text: '太棒了！你完成了看似不可能的任务。你已经证明了自己是一名合格的无人机飞手。'
            },
            {
              character: '你',
              characterIcon: '🧑',
              text: '谢谢您，是这次经历让我成长了很多。'
            },
            {
              character: '指挥员',
              characterIcon: '👨‍🚀',
              text: '这只是开始。无人机的世界还有更多精彩等着你去探索。继续努力吧，飞手！'
            }
          ],
          options: [
            {
              id: 'a',
              text: '查看完整结局',
              tag: 'main',
              tagText: '主线',
              resultPreview: '恭喜你完成了一段精彩的旅程',
              nextScene: 'ending_main',
              effect: { achievement: +1 }
            },
            {
              id: 'b',
              text: '探索隐藏结局',
              tag: 'secret',
              tagText: '隐藏',
              resultPreview: '发现故事的真谛...',
              nextScene: 'ending_secret',
              effect: { wisdom: +1 },
              secretTrigger: true
            }
          ]
        }
      ],
      status: 'locked',
      locked: true,
      progress: '0/3'
    }
  },

  onLoad(options) {
    // 优先从持久化存储恢复章节完成状态，避免退出小程序后丢失
    const persisted = storage.getStorySecretUnlocked()
    if (persisted && Object.keys(persisted).length > 0) {
      app.globalData.storySecretUnlocked = {
        ...(app.globalData.storySecretUnlocked || {}),
        ...persisted
      }
    }
    this.initChapters()
  },

  onShow() {
    // 从其他页面返回 story 时（如完成剧情后返回）重新计算解锁状态
    if (this.data.chapters && this.data.chapters.length > 0) {
      // 同步最新持久化状态
      const persisted = storage.getStorySecretUnlocked()
      if (persisted) {
        app.globalData.storySecretUnlocked = {
          ...(app.globalData.storySecretUnlocked || {}),
          ...persisted
        }
      }
      this.initChapters()
    }
  },

  // 初始化章节数据
  initChapters() {
    const chapters = Object.values(this.chapterData)
    const secretUnlocked = app.globalData.storySecretUnlocked || {}

    // 计算总进度，并按 1→2→3→4 顺序解锁
    let completedCount = 0
    let prevChapterCompleted = true  // 章节 1 永远可开始

    chapters.forEach((chapter) => {
      if (secretUnlocked[chapter.id]) {
        chapter.status = 'completed'
        chapter.locked = false
        completedCount++
        prevChapterCompleted = true
      } else if (prevChapterCompleted) {
        // 前一章已完成 → 本章可开始
        chapter.locked = false
        chapter.status = 'new'
        prevChapterCompleted = false
      } else {
        // 前一章未完成 → 本章锁定
        chapter.locked = true
        chapter.status = 'locked'
      }
    })

    // 更新进度
    const progress = completedCount / chapters.length

    this.setData({
      chapters,
      progress,
      secretUnlocked
    })
  },

  // 章节点击
  onChapterTap(e) {
    const chapterId = e.currentTarget.dataset.chapterId
    // 统一从 this.data.chapters 读取动态状态（不再依赖 chapterData 硬编码）
    const chapter = (this.data.chapters || []).find((c) => c.id === chapterId)

    if (!chapter || chapter.locked) {
      wx.showToast({
        title: '该章节未解锁',
        icon: 'none'
      })
      return
    }

    this.setData({
      isChapterMode: false,
      currentChapterId: chapterId,
      currentChapter: chapter,
      currentSceneIndex: 0,
      storyPath: []
    })

    // 加载第一个场景
    this.loadScene(0)
  },

  // 加载场景
  loadScene(sceneIndex) {
    const { currentChapter } = this.data
    if (!currentChapter) return

    const scene = currentChapter.scenes[sceneIndex]
    if (!scene) {
      // 章节结束
      this.handleChapterEnd()
      return
    }

    // 重置状态
    this.setData({
      currentSceneIndex: sceneIndex,
      currentNarration: scene.narration,
      displayedNarration: '',
      currentDialogues: scene.dialogues.map(d => ({
        ...d,
        displayedText: ''
      })),
      currentOptions: [],
      showOptions: false,
      showSecretHint: false,
      isTyping: true
    })

    // 显示隐藏结局提示
    if (scene.secretHint && this.checkSecretCondition(scene)) {
      this.setData({
        showSecretHint: true,
        secretHint: scene.secretHint
      })
    }

    // 开始打字机效果
    this.startNarrationTyping(scene.narration, () => {
      this.startDialogueTyping(scene.dialogues, () => {
        this.showSceneOptions(scene.options)
      })
    })
  },

  // 检查是否满足显示隐藏提示条件
  checkSecretCondition(scene) {
    const { storyPath } = this.data
    // 根据剧情路径判断是否满足隐藏条件
    // 这里简单处理，只要玩家做了选择就显示
    return storyPath.length >= 1
  },

  // 开始叙述打字机效果
  startNarrationTyping(text, callback) {
    this.setData({
      fullText: text,
      typingIndex: 0
    })

    this.typingTimer = setInterval(() => {
      const { typingIndex, fullText } = this.data
      if (typingIndex >= fullText.length) {
        clearInterval(this.typingTimer)
        this.setData({
          displayedNarration: fullText,
          isTyping: false
        })
        if (callback) callback()
        return
      }

      this.setData({
        displayedNarration: fullText.substring(0, typingIndex + 1),
        typingIndex: typingIndex + 1
      })
    }, 50)
  },

  // 开始对话打字机效果
  startDialogueTyping(dialogues, callback) {
    if (!dialogues || dialogues.length === 0) {
      if (callback) callback()
      return
    }

    let dialogueIndex = 0
    this.setData({
      currentDialogues: dialogues.map((d, i) => ({
        ...d,
        displayedText: ''
      }))
    })

    const typeNextDialogue = () => {
      if (dialogueIndex >= dialogues.length) {
        if (callback) callback()
        return
      }

      const dialogue = dialogues[dialogueIndex]
      let charIndex = 0
      const dialogueTimer = setInterval(() => {
        const currentDialogues = this.data.currentDialogues
        if (charIndex >= dialogue.text.length) {
          clearInterval(dialogueTimer)
          currentDialogues[dialogueIndex].displayedText = dialogue.text
          this.setData({ currentDialogues })
          dialogueIndex++
          setTimeout(typeNextDialogue, 300)
          return
        }

        currentDialogues[dialogueIndex].displayedText = dialogue.text.substring(0, charIndex + 1)
        this.setData({ currentDialogues })
        charIndex++
      }, 30)
    }

    typeNextDialogue()
  },

  // 显示选项
  showSceneOptions(options) {
    if (!options || options.length === 0) return

    this.setData({
      currentOptions: options,
      showOptions: true,
      isTyping: false
    })
  },

  // 选项点击
  onOptionTap(e) {
    const optionId = e.currentTarget.dataset.optionId
    const option = this.data.currentOptions.find(o => o.id === optionId)

    if (!option) return

    this.setData({
      selectedOption: option,
      showConfirm: true
    })
  },

  // 确认选择
  onConfirmChoice() {
    const { selectedOption, currentChapter, currentSceneIndex, storyPath } = this.data

    // 记录选择
    storyPath.push({
      chapterId: currentChapter.id,
      sceneIndex: currentSceneIndex,
      optionId: selectedOption.id,
      optionText: selectedOption.text
    })

    this.setData({
      showConfirm: false,
      storyPath,
      showOptions: false
    })

    // 检查是否是隐藏选项
    if (selectedOption.secretTrigger) {
      this.unlockSecret(currentChapter.id)
    }

    // 检查是否有下一章节
    if (selectedOption.nextChapter) {
      this.goToNextChapter(selectedOption.nextChapter)
      return
    }

    // 检查是否是特殊场景
    if (typeof selectedOption.nextScene === 'string') {
      if (selectedOption.nextScene.startsWith('secret')) {
        this.showSecretEnding(selectedOption.nextScene)
        return
      }
      if (selectedOption.nextScene === 'ending_main') {
        this.showMainEnding()
        return
      }
      if (selectedOption.nextScene === 'ending_secret') {
        this.showSecretEnding('ending_secret')
        return
      }
    }

    // 延迟后进入下一个场景
    setTimeout(() => {
      this.loadScene(selectedOption.nextScene)
    }, 500)
  },

  // 取消确认
  onCancelConfirm() {
    this.setData({
      showConfirm: false,
      selectedOption: null
    })
  },

  // 保持确认框
  onKeepConfirm() {
    // 阻止冒泡，什么都不做
  },

  // 解锁隐藏结局
  unlockSecret(chapterId) {
    const { secretUnlocked } = this.data
    secretUnlocked[chapterId] = true

    app.globalData.storySecretUnlocked = secretUnlocked
    // 持久化：避免退出小程序后丢失
    storage.setStorySecretUnlocked(secretUnlocked)

    wx.showToast({
      title: '🔮 发现隐藏线索',
      icon: 'none',
      duration: 2000
    })
  },

  // 进入下一章节
  goToNextChapter(chapterId) {
    // 从 data.chapters 中找章节（动态状态，非硬编码数据）
    const chapter = this.data.chapters.find((c) => c.id === chapterId)
    if (!chapter || chapter.locked) {
      wx.showToast({
        title: '该章节未解锁',
        icon: 'none'
      })
      return
    }

    // 找到 chapterData 中的原始数据
    const rawChapter = this.chapterData[chapterId]
    if (!rawChapter) return

    this.setData({
      currentChapterId: chapterId,
      currentChapter: rawChapter,
      currentSceneIndex: 0,
      storyPath: []
    })

    this.loadScene(0)
  },

  // 处理章节结束
  handleChapterEnd() {
    const { currentChapter, secretUnlocked } = this.data

    // 标记章节完成
    secretUnlocked[currentChapter.id] = true
    app.globalData.storySecretUnlocked = secretUnlocked
    // 持久化：避免退出小程序后丢失（章节2/3/4 才能正确解锁）
    storage.setStorySecretUnlocked(secretUnlocked)

    wx.showModal({
      title: '🎉 章节完成',
      content: `恭喜你完成了第${currentChapter.id}章：${currentChapter.title}`,
      showCancel: false,
      success: () => {
        this.setData({
          isChapterMode: true
        })
        this.initChapters()
      }
    })
  },

  // 显示主线结局
  showMainEnding() {
    wx.showModal({
      title: '🌟 剧情完成',
      content: '恭喜你完成了剧情模式的主线结局！你展现了作为无人机飞手的勇气和决心。继续探索，你还能发现更多隐藏的秘密...',
      showCancel: false,
      success: () => {
        this.handleChapterEnd()
      }
    })
  },

  // 显示隐藏结局
  showSecretEnding(endingType) {
    let title, content

    if (endingType === 'ending_secret') {
      title = '🔮 隐藏结局：真相'
      content = '你发现了故事的真相——无人机不仅仅是工具，它们是人类探索天空的伙伴，是连接人与人之间的纽带。在这个充满挑战的世界里，正是人与人之间的信任，创造了最美好的未来。\n\n感谢你完成了隐藏结局！'
    } else {
      title = '🔮 隐藏结局'
      content = '你触发了隐藏剧情，发现了意想不到的故事发展...'
    }

    wx.showModal({
      title,
      content,
      showCancel: false,
      success: () => {
        this.handleChapterEnd()
      }
    })
  },

  // 返回
  goBack() {
    if (this.data.isChapterMode) {
      wx.navigateBack()
    } else {
      wx.showModal({
        title: '确认退出',
        content: '确定要退出剧情吗？你的进度将会保存。',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              isChapterMode: true
            })
            this.initChapters()
          }
        }
      })
    }
  },

  onUnload() {
    if (this.typingTimer) {
      clearInterval(this.typingTimer)
    }
  }
})