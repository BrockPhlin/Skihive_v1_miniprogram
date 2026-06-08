Component({
  properties: {
    // 标签数组
    labels: { type: Array, value: ['勇敢', '创意', '稳定', '趣味'] },
    // 数据数组 (0-100)
    data: { type: Array, value: [0, 0, 0, 0] },
    // 最大值
    maxValue: { type: Number, value: 100 },
    // 画布大小
    size: { type: Number, value: 280 },
    // 填充颜色
    fillColor: { type: String, value: 'rgba(133, 94, 227, 0.3)' },
    // 边框颜色
    strokeColor: { type: String, value: '#855ee3' },
    // 是否显示动画
    animated: { type: Boolean, value: true },
  },

  data: {
    canvasWidth: 280,
    canvasHeight: 280,
    animationData: [],
  },

  observers: {
    'data': function(newData) {
      if (this.data.animated) {
        this.animateData(newData);
      } else {
        this.setData({ animationData: newData });
        this.drawRadar();
      }
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        canvasWidth: this.data.size,
        canvasHeight: this.data.size,
      });
      if (!this.data.animated) {
        this.setData({ animationData: this.data.data });
      }
    },
  },

  methods: {
    animateData(targetData) {
      const startData = this.data.animationData.length > 0
        ? this.data.animationData
        : targetData.map(() => 0);

      const duration = 1500;
      const startTime = Date.now();

      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        const newData = targetData.map((target, i) => {
          const start = startData[i] || 0;
          return start + (target - start) * eased;
        });

        this.setData({ animationData: newData });
        this.drawRadar();

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      step();
    },

    drawRadar() {
      const ctx = wx.createCanvasContext('radarCanvas', this);
      const { labels, animationData, maxValue, size } = this.data;
      const center = size / 2;
      const radius = size / 2 - 40;

      ctx.clearRect(0, 0, size, size);

      // Draw background grid
      ctx.setStrokeStyle('rgba(255, 255, 255, 0.1)');
      ctx.setLineWidth(1);

      for (let i = 1; i <= 5; i++) {
        const r = radius * (i / 5);
        ctx.beginPath();
        for (let j = 0; j <= labels.length; j++) {
          const index = j % labels.length;
          const angle = (Math.PI * 2 / labels.length) * index - Math.PI / 2;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw axes
      for (let i = 0; i < labels.length; i++) {
        const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw data area
      if (animationData.length > 0) {
        ctx.beginPath();
        for (let i = 0; i <= labels.length; i++) {
          const index = i % labels.length;
          const value = animationData[index] || 0;
          const ratio = Math.min(value / maxValue, 1);
          const angle = (Math.PI * 2 / labels.length) * index - Math.PI / 2;
          const x = center + radius * ratio * Math.cos(angle);
          const y = center + radius * ratio * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.setFillStyle(this.data.fillColor);
        ctx.fill();
        ctx.setStrokeStyle(this.data.strokeColor);
        ctx.setLineWidth(2);
        ctx.stroke();

        // Draw data points
        for (let i = 0; i < labels.length; i++) {
          const value = animationData[i] || 0;
          const ratio = Math.min(value / maxValue, 1);
          const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
          const x = center + radius * ratio * Math.cos(angle);
          const y = center + radius * ratio * Math.sin(angle);

          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.setFillStyle(this.data.strokeColor);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.setFillStyle('#ffffff');
          ctx.fill();
        }
      }

      // Draw labels
      ctx.setFillStyle('rgba(255, 255, 255, 0.8)');
      ctx.setFontSize(12);
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');

      for (let i = 0; i < labels.length; i++) {
        const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
        const x = center + (radius + 30) * Math.cos(angle);
        const y = center + (radius + 30) * Math.sin(angle);
        ctx.fillText(labels[i], x, y);
      }

      ctx.draw();
    },
  },
});