Component({
  properties: {
    // 当前值 0-100
    value: { type: Number, value: 0 },
    // 是否显示动画
    animated: { type: Boolean, value: true },
    // 进度条高度
    height: { type: String, value: '12rpx' },
    // 颜色类型: primary, success, warning, danger, gold
    color: { type: String, value: 'primary' },
    // 是否显示流光效果
    shimmer: { type: Boolean, value: false },
    // 是否显示背景
    showBackground: { type: Boolean, value: true },
    // 圆角
    radius: { type: String, value: '6rpx' },
  },

  data: {
    displayValue: 0,
  },

  observers: {
    'value': function(newVal) {
      if (this.data.animated) {
        this.animateTo(newVal);
      } else {
        this.setData({ displayValue: newVal });
      }
    },
  },

  methods: {
    animateTo(target) {
      const start = this.data.displayValue;
      const diff = target - start;
      const duration = 800;
      const startTime = Date.now();

      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + diff * eased);
        this.setData({ displayValue: current });

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      step();
    },
  },
});