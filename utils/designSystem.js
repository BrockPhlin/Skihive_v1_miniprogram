/**
 * SkiHive Design System
 * 设计系统常量 - 统一颜色、阴影、圆角、间距、字体
 *
 * v1.1 新增：深空赛博风（DEEP_SPACE_CYBER）主题色板。
 * 与 app.wxss 里的 CSS 变量一一对应，JS 端如果需要取色，
 * 应优先从这里取，而不是硬编码 hex。
 */

module.exports = {
  // ==================== 颜色系统 ====================
  COLORS: {
    // 主色系
    primary: '#855ee3',
    primaryLight: '#9d7ff0',
    primaryDark: '#6c4bd4',
    primaryGradient: 'linear-gradient(135deg, #855ee3 0%, #6c4bd4 100%)',

    // 辅助色系
    secondary: '#e67e22',
    secondaryLight: '#f39c12',
    accent: '#00d2d3',
    accentLight: '#54d8d9',

    // 状态色
    success: '#22c55e',
    successLight: '#4ade80',
    warning: '#fdcb6e',
    warningLight: '#ffeaa7',
    error: '#ef4444',
    errorLight: '#f87171',

    // 背景色系
    bgDark: '#1a1a2e',
    bgMedium: '#16213e',
    bgLight: '#0f3460',
    bgCard: 'rgba(22, 33, 62, 0.8)',
    bgCardLight: 'rgba(30, 45, 80, 0.9)',
    bgOverlay: 'rgba(0, 0, 0, 0.6)',

    // 文字色系
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    textDark: '#1a1a2e',

    // 边框色
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderMedium: 'rgba(255, 255, 255, 0.2)',
    borderFocus: 'rgba(133, 94, 227, 0.5)',

    // 特殊色
    gold: '#ffd700',
    goldGradient: 'linear-gradient(135deg, #fdcb6e 0%, #e67e22 100%)',
    silver: '#c0c0c0',
    bronze: '#cd7f32',
  },

  // ==================== v1.1 深空赛博风主题 ====================
  DEEP_SPACE_CYBER: {
    gold: '#ffb547',
    goldBright: '#ffd27a',
    goldDim: '#c9892c',
    goldGlow: 'rgba(255, 181, 71, 0.55)',

    cyan: '#5cf3ff',
    cyanBright: '#9efcff',
    cyanDim: '#1ab8c4',
    cyanGlow: 'rgba(92, 243, 255, 0.5)',

    plasma: '#a78bff',
    plasmaDim: '#6e57c4',
    plasmaGlow: 'rgba(167, 139, 255, 0.45)',

    void: '#03040a',
    space: '#05060d',
    space2: '#0a0d1c',
    space3: '#11152a',
    space4: '#1a2040',

    ink: '#e6ecff',
    inkDim: 'rgba(230, 236, 255, 0.72)',
    inkMute: 'rgba(230, 236, 255, 0.45)',
    inkFaint: 'rgba(230, 236, 255, 0.22)',

    line: 'rgba(167, 139, 255, 0.18)',
    lineBright: 'rgba(92, 243, 255, 0.4)',
    lineGold: 'rgba(255, 181, 71, 0.4)',

    fontDisplay: "'Major Mono Display', 'Space Mono', 'JetBrains Mono', ui-monospace, 'SF Mono', 'Cascadia Mono', monospace",
    fontMono: "'JetBrains Mono', 'SF Mono', 'Cascadia Mono', ui-monospace, 'Menlo', monospace",
    fontBody: "'PingFang SC', 'HarmonyOS Sans SC', 'Hiragino Sans GB', system-ui, -apple-system, sans-serif",
    fontCjk: "'PingFang SC', 'HarmonyOS Sans SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
  },

  // ==================== 阴影系统 ====================
  SHADOWS: {
    small: '0 2rpx 8rpx rgba(0, 0, 0, 0.3)',
    medium: '0 4rpx 16rpx rgba(133, 94, 227, 0.3)',
    large: '0 8rpx 32rpx rgba(133, 94, 227, 0.4)',
    glow: '0 0 20rpx rgba(133, 94, 227, 0.6)',
    glowAccent: '0 0 20rpx rgba(0, 210, 211, 0.6)',
    glowGold: '0 0 20rpx rgba(255, 215, 0, 0.6)',
    inner: 'inset 0 2rpx 8rpx rgba(0, 0, 0, 0.3)',
    card: '0 10rpx 40rpx rgba(0, 0, 0, 0.4)',
    cardHover: '0 15rpx 50rpx rgba(0, 0, 0, 0.5)',
  },

  // ==================== 圆角系统 ====================
  RADIUS: {
    small: '8rpx',
    medium: '16rpx',
    large: '24rpx',
    pill: '50rpx',
    circle: '50%',
    card: '20rpx',
    button: '50rpx',
  },

  // ==================== 间距系统 ====================
  SPACING: {
    xs: '8rpx',
    sm: '16rpx',
    md: '24rpx',
    lg: '32rpx',
    xl: '48rpx',
    xxl: '64rpx',
    page: '30rpx',
    section: '40rpx',
  },

  // ==================== 字体系统 ====================
  FONTS: {
    size: {
      xs: '18rpx',
      sm: '20rpx',
      md: '24rpx',
      lg: '28rpx',
      xl: '32rpx',
      title: '36rpx',
      heading: '40rpx',
      hero: '48rpx',
    },
    weight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    family: 'system-ui, -apple-system, sans-serif',
  },

  // ==================== 动画系统 ====================
  ANIMATIONS: {
    // 页面过渡
    pageEnter: { duration: 400, easing: 'ease-out' },
    pageExit: { duration: 300, easing: 'ease-in' },

    // 微交互
    button: { scale: 0.95, duration: 100 },
    buttonRelease: { scale: 1.0, duration: 150 },
    cardHover: { scale: 1.02, duration: 200 },
    cardTap: { scale: 0.98, duration: 100 },

    // 弹窗
    modal: { duration: 300, easing: 'ease-out' },
    tooltip: { duration: 200, easing: 'ease-out' },

    // 数据动画
    countUp: { duration: 1000, delay: 200 },
    progressFill: { duration: 800, delay: 300 },
    radarDraw: { duration: 1500, delay: 500 },
    barGrow: { duration: 600, delay: 200 },

    // 循环动画时长
    float: { duration: 3000, easing: 'ease-in-out', loop: true },
    pulse: { duration: 1500, easing: 'ease-out', loop: true },
    shimmer: { duration: 2000, easing: 'linear', loop: true },
    blink: { duration: 1000, easing: 'ease-in-out', loop: true },
    glow: { duration: 2000, easing: 'ease-in-out', loop: true },
    rotate: { duration: 1000, easing: 'linear', loop: true },
    bounce: { duration: 600, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', loop: false },
    shake: { duration: 500, easing: 'ease-out', loop: false },
  },

  // ==================== Z-Index 层级 ====================
  ZINDEX: {
    base: 1,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    loading: 800,
    toast: 900,
  },

  // ==================== 断点系统 ====================
  BREAKPOINTS: {
    small: '320rpx',
    medium: '375rpx',
    large: '414rpx',
    xlarge: '480rpx',
  },

  // ==================== 主题配置 ====================
  THEMES: {
    dark: {
      bg: '#1a1a2e',
      bgMedium: '#16213e',
      bgLight: '#0f3460',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
    },
    light: {
      bg: '#f5f5f5',
      bgMedium: '#ffffff',
      bgLight: '#e0e0e0',
      text: '#1a1a2e',
      textSecondary: 'rgba(26, 26, 46, 0.7)',
    },
  },
}