# 低空装配与仿真平台

## 项目简介

低空装配与仿真平台是一个基于微信小程序的无人机装配与飞行评估系统。用户通过选择环境模式、装配组件、体验虚拟飞行和 AI 评估。

## 功能特性

### 核心功能

- **环境选择**：航拍出片、室内练习、高速飞行、入门教学四种环境模式
- **组件装配**：螺旋桨、电机、电池、传感器、机架、相机六类组件的选型
- **虚拟飞行**：模拟飞行过程，记录飞行时间和状态
- **AI 评估**：基于飞行数据和装配配置生成专业评价
- **剧情模式**：多章节分支式飞行故事
- **成就 / 商店 / 数据统计 / 飞行记录**：完整的用户成长体系

### 技术特点

- 微信小程序原生开发
- Vant Weapp 组件库
- DeepSeek AI 接口（用于事件生成与故事创作）
- 设计系统 + 动画系统工具集
- 响应式设计，rpx 适配

## 项目结构

```
├── app.js / app.json / app.wxss     # 小程序入口
├── app.miniapp.json                 # 多端配置
├── project.config.json              # 微信开发者工具配置
├── project.private.config.json      # 私有配置（含 defineConstants）
│
├── pages/                           # 主包页面
│   ├── index/                       # 首页
│   ├── login/                       # 登录
│   ├── register/                    # 注册
│   ├── environment/                 # 环境选择
│   ├── task-card/                   # 任务卡选择
│   ├── flight-records/              # 飞行记录
│   ├── analytics/                   # 数据统计
│   ├── achievement/                 # 成就
│   ├── shop/                        # 商店
│   └── tutorial/                    # 新手教学
│
├── packageA/                        # 分包（按需加载）
│   ├── pages/
│   │   ├── assembly/                # 装配（创作工作台）
│   │   ├── flying/                  # 飞行
│   │   ├── result/                  # 飞行结果
│   │   ├── story/                   # 剧情模式
│   │   └── share-poster/            # 分享海报
│   ├── components/
│   │   └── event-card/              # 事件卡片
│   └── utils/
│       └── eventEngine.js           # 事件 / AI 引擎
│
├── components/                      # 自定义组件
│   ├── animated-number/             # 数字动画
│   ├── button/                      # 通用按钮
│   ├── card/                        # 通用卡片
│   ├── navigation-bar/              # 自定义导航栏
│   ├── particle-bg/                 # 粒子背景
│   ├── progress-bar/                # 进度条
│   └── radar-chart/                 # 雷达图
│
├── utils/                           # 工具函数
│   ├── animationSystem.js           # 动画工具
│   ├── assemblyScore.js             # 装配评分
│   ├── crypto.js                    # 密码哈希
│   ├── designSystem.js              # 设计系统常量
│   ├── personality.js               # 飞手人格计算
│   ├── storage.js                   # 本地存储封装
│   └── util.js                      # 通用工具
│
├── i18n/                            # 国际化占位
└── assets/                          # 静态资源
```

## 安装与运行

### 前置条件

- 微信开发者工具
- Node.js（用于安装 Vant Weapp 等 npm 依赖）

### 安装步骤

1. 克隆项目
   ```bash
   git clone https://github.com/brockphlin/skihive_v1.git
   cd skihive_v1
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 微信开发者工具导入项目根目录

4. 在 `project.private.config.json` 的 `defineConstants` 中填入 `DEEPSEEK_API_KEY`（AI 事件 / 故事生成需要）

5. 编译运行

## 使用说明

### 基本流程

1. 登录 / 注册（本地账号体系）
2. 选择今日任务（10 个预设场景）
3. 装配飞行器（母体 + 外壳 + 配色 + 点缀件 + 功能模块）
4. 开始飞行（事件卡片互动 + 电量管理）
5. 飞行结束查看评估（性能评分 + AI 故事 + 飞手人格 + 分享海报）

### AI 评估功能

- DeepSeek Chat 模型根据飞行事件生成后续事件
- 飞行结束后根据完整事件链生成连贯故事
- API Key 通过 `project.private.config.json` 的 `defineConstants` 注入

## 配置项

`project.private.config.json` 中的 `defineConstants`：

- `DEEPSEEK_API_KEY`：DeepSeek 平台 API Key

## 维护记录

- 2026-04-01：v_1
  - 文件夹结构优化
  - 微信登录
- 2026-04-02：v_1
  - 实现分包加载（packageA）
- 2026-06-01：v_1.1
  - 清理冗余代码
  - 修复事件引擎和结果页的模型名
  - 修正 `utils/crypto.js` 的函数命名
  - 统一入口应用的状态管理
  - 更新 README
