Component({
  properties: {
    // 粒子数量
    count: { type: Number, value: 30 },
    // 粒子颜色
    color: { type: String, value: 'rgba(133, 94, 227, 0.3)' },
    // 粒子大小范围 [min, max]
    sizeRange: { type: Array, value: [2, 6] },
    // 是否运动
    animated: { type: Boolean, value: true },
    // 运动速度范围 [min, max]
    speedRange: { type: Array, value: [0.2, 0.8] },
  },

  data: {
    particles: [],
    canvasWidth: 375,
    canvasHeight: 667,
  },

  lifetimes: {
    attached() {
      const res = wx.getSystemInfoSync();
      const width = res.windowWidth || 375;
      const height = res.windowHeight || 667;
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      });
      this.initParticles();
      if (this.data.animated) {
        this.startAnimation();
      }
    },

    detached() {
      this._stopAnimation = true;
    },
  },

  methods: {
    initParticles() {
      const particles = [];
      const { count, sizeRange, speedRange, canvasWidth, canvasHeight } = this.data;

      for (let i = 0; i < count; i++) {
        const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
        const speed = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);

        particles.push({
          id: i,
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          size: size,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          opacity: 0.2 + Math.random() * 0.4,
          angle: Math.random() * 360,
          rotateSpeed: (Math.random() - 0.5) * 2,
        });
      }

      this.setData({ particles });
    },

    startAnimation() {
      let lastTime = Date.now();
      const { canvasWidth, canvasHeight } = this.data;

      const animate = () => {
        if (this._stopAnimation) return;

        const now = Date.now();
        const dt = (now - lastTime) / 16.67;
        lastTime = now;

        const particles = this.data.particles.map(p => {
          let x = p.x + p.speedX * dt;
          let y = p.y + p.speedY * dt;
          let angle = p.angle + p.rotateSpeed * dt;

          // Wrap around edges
          if (x < 0) x = canvasWidth;
          if (x > canvasWidth) x = 0;
          if (y < 0) y = canvasHeight;
          if (y > canvasHeight) y = 0;

          return { ...p, x, y, angle };
        });

        this.setData({ particles });

        // 兜底：requestAnimationFrame 不存在时用 setTimeout 模拟
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(animate);
        } else {
          setTimeout(animate, 16);
        }
      };

      animate();
    },
  },
});
