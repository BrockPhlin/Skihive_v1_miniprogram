/**
 * SkiHive Animation System
 * 动画工具库 - 提供常用的动画工具函数
 */

const ANIMATIONS = require('./designSystem').ANIMATIONS;

/**
 * 等待指定毫秒
 * @param {number} ms - 毫秒数
 * @returns {Promise}
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 链式执行动画序列
 * @param {Array} animations - 动画函数数组
 */
const chain = async (animations) => {
  for (const anim of animations) {
    await anim();
  }
};

/**
 * 并行执行动画
 * @param {Array} animations - 动画函数数组
 */
const parallel = async (animations) => {
  await Promise.all(animations.map(a => a()));
};

/**
 * 数字滚动动画
 * @param {number} target - 目标值
 * @param {Function} setter - 设置值的回调函数
 * @param {number} duration - 动画时长(ms)
 */
const animateNumber = (target, setter, duration = 1000) => {
  const start = 0;
  const startTime = Date.now();

  const step = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    setter(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  step();
};

/**
 * 渐进式数字动画（从当前值到目标值）
 * @param {number} target - 目标值
 * @param {number} current - 当前值
 * @param {Function} setter - 设置值的回调函数
 * @param {number} duration - 动画时长(ms)
 */
const animateNumberFrom = (target, current, setter, duration = 1000) => {
  const start = current;
  const diff = target - start;
  const startTime = Date.now();

  const step = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + diff * eased);
    setter(value);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  step();
};

/**
 * 进度条填充动画
 * @param {number} targetPercent - 目标百分比 (0-100)
 * @param {Function} setter - 设置百分比的回调函数
 * @param {number} duration - 动画时长(ms)
 */
const animateProgress = (targetPercent, setter, duration = 800) => {
  animateNumber(targetPercent, setter, duration);
};

/**
 * 弹性动画效果值
 * @param {number} progress - 进度 (0-1)
 * @param {object} config - 配置 { amplitude, period }
 */
const easeOutElastic = (progress, config = { amplitude: 1, period: 0.3 }) => {
  const { amplitude, period } = config;
  if (progress === 0 || progress === 1) return progress;
  const s = period / (2 * Math.PI) * Math.asin(1 / amplitude);
  return Math.pow(2, -10 * progress) * Math.sin((progress - s) * (2 * Math.PI) / period) + 1;
};

/**
 * 弹簧动画
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {Function} setter - 设置值的回调函数
 * @param {number} duration - 动画时长(ms)
 */
const springAnimation = (start, end, setter, duration = 600) => {
  const startTime = Date.now();
  const amplitude = 0.15;
  const period = 0.4;

  const step = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutElastic(progress, { amplitude, period });
    const current = start + (end - start) * eased;
    setter(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  step();
};

/**
 * 创建脉冲动画的缩放值
 * @param {number} time - 当前时间
 * @param {number} min - 最小缩放
 * @param {number} max - 最大缩放
 * @param {number} duration - 周期时长
 */
const pulseScale = (time, min = 0.95, max = 1.05, duration = 1500) => {
  const progress = (time % duration) / duration;
  return min + (max - min) * Math.sin(progress * Math.PI);
};

/**
 * 颜色插值
 * @param {string} color1 - 起始颜色 (hex)
 * @param {string} color2 - 结束颜色 (hex)
 * @param {number} progress - 进度 (0-1)
 */
const lerpColor = (color1, color2, progress) => {
  const hex2rgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgb2hex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  const c1 = hex2rgb(color1);
  const c2 = hex2rgb(color2);

  return rgb2hex(
    c1.r + (c2.r - c1.r) * progress,
    c1.g + (c2.g - c1.g) * progress,
    c1.b + (c2.b - c1.b) * progress
  );
};

/**
 * 交错延迟计算
 * @param {number} index - 元素索引
 * @param {number} baseDelay - 基础延迟 (ms)
 */
const staggerDelay = (index, baseDelay = 100) => index * baseDelay;

/**
 * 创建抖动动画
 * @param {number} intensity - 强度
 * @returns {object} - { x, y } 偏移量
 */
const shakeOffset = (intensity = 5) => ({
  x: (Math.random() - 0.5) * intensity * 2,
  y: (Math.random() - 0.5) * intensity * 2,
});

/**
 * 雷达图绘制数据动画
 * @param {Array} targetData - 目标数据数组
 * @param {Array} currentData - 当前数据数组
 * @param {Function} setter - 设置数据的回调函数
 * @param {number} duration - 动画时长(ms)
 */
const animateRadarChart = (targetData, currentData, setter, duration = 1500) => {
  const startTime = Date.now();
  const startData = [...currentData];

  const step = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    const newData = targetData.map((target, i) => {
      const start = startData[i] || 0;
      return start + (target - start) * eased;
    });

    setter(newData);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  step();
};

/**
 * 渐入渐出透明度
 * @param {number} time - 当前时间
 * @param {number} fadeInDuration - 渐入时长
 * @param {number} holdDuration - 保持时长
 * @param {number} fadeOutDuration - 渐出时长
 */
const fadeOpacity = (time, fadeInDuration, holdDuration, fadeOutDuration) => {
  const totalDuration = fadeInDuration + holdDuration + fadeOutDuration;
  const t = time % totalDuration;

  if (t < fadeInDuration) {
    return t / fadeInDuration;
  } else if (t < fadeInDuration + holdDuration) {
    return 1;
  } else {
    return 1 - (t - fadeInDuration - holdDuration) / fadeOutDuration;
  }
};

/**
 * 浮动动画偏移量
 * @param {number} time - 当前时间
 * @param {number} amplitude - 振幅
 * @param {number} duration - 周期时长
 */
const floatOffset = (time, amplitude = 20, duration = 3000) => {
  const progress = (time % duration) / duration;
  return Math.sin(progress * 2 * Math.PI) * amplitude;
};

/**
 * 缩放动画
 * @param {number} progress - 进度 (0-1)
 * @param {string} type - 缓动类型 'easeOut' | 'easeIn' | 'easeInOut'
 */
const scaleEase = (progress, type = 'easeOut') => {
  switch (type) {
    case 'easeIn':
      return Math.pow(progress, 2);
    case 'easeInOut':
      return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    case 'easeOut':
    default:
      return 1 - Math.pow(1 - progress, 3);
  }
};

// 导出所有动画常量
const ANIMATION_PRESETS = {
  float: ANIMATIONS.float,
  pulse: ANIMATIONS.pulse,
  shimmer: ANIMATIONS.shimmer,
  blink: ANIMATIONS.blink,
  glow: ANIMATIONS.glow,
  rotate: ANIMATIONS.rotate,
  bounce: ANIMATIONS.bounce,
  shake: ANIMATIONS.shake,
};

module.exports = {
  // 核心函数
  wait,
  chain,
  parallel,

  // 数值动画
  animateNumber,
  animateNumberFrom,
  animateProgress,
  animateRadarChart,

  // 特殊动画
  springAnimation,
  pulseScale,

  // 工具函数
  lerpColor,
  staggerDelay,
  shakeOffset,
  floatOffset,
  fadeOpacity,
  scaleEase,

  // 预设
  ANIMATION_PRESETS,
};