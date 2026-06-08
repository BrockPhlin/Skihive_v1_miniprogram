Component({
  properties: {
    // 当前值
    value: { type: Number, value: 0 },
    // 动画时长(ms)
    duration: { type: Number, value: 1000 },
    // 前缀
    prefix: { type: String, value: '' },
    // 后缀
    suffix: { type: String, value: '' },
    // 是否显示千分位
    thousand: { type: Boolean, value: false },
    // 小数位数
    decimal: { type: Number, value: 0 },
    // 字体大小
    size: { type: String, value: '48rpx' },
    // 字体颜色
    color: { type: String, value: '#ffffff' },
    // 是否粗体
    bold: { type: Boolean, value: false },
  },

  data: {
    displayValue: 0,
  },

  observers: {
    'value': function(newVal) {
      this.animateTo(newVal);
    },
  },

  methods: {
    animateTo(target) {
      const start = this.data.displayValue;
      const diff = target - start;
      const duration = this.data.duration;
      const startTime = Date.now();

      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + diff * eased;

        // Apply decimal
        const fixed = this.data.decimal > 0 ? current.toFixed(this.data.decimal) : Math.round(current);
        this.setData({ displayValue: Number(fixed) });

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      step();
    },

    formatNumber(num) {
      if (!this.data.thousand) return num;
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
});