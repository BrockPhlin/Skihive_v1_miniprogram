Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },

  properties: {
    // 按钮类型: primary, secondary, ghost, danger, success
    type: {
      type: String,
      value: 'primary',
    },
    // 按钮尺寸: small, medium, large
    size: {
      type: String,
      value: 'medium',
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false,
    },
    // 是否加载中
    loading: {
      type: Boolean,
      value: false,
    },
    // 是否占满宽度
    block: {
      type: Boolean,
      value: false,
    },
    // 图标（可选）
    icon: {
      type: String,
      value: '',
    },
    // 是否镂空样式
    plain: {
      type: Boolean,
      value: false,
    },
    // 圆角样式: default, pill, circle
    shape: {
      type: String,
      value: 'default',
    },
    // 自定义类名
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    isPressed: false,
  },

  methods: {
    onTap() {
      if (this.data.disabled || this.data.loading) return;

      this.setData({ isPressed: true });
      setTimeout(() => {
        this.setData({ isPressed: false });
      }, 150);

      this.triggerEvent('click');
    },

    onLongPress() {
      if (this.data.disabled || this.data.loading) return;
      this.triggerEvent('longpress');
    },
  },
});