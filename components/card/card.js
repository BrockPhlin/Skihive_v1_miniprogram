Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },

  properties: {
    // 卡片标题
    title: {
      type: String,
      value: '',
    },
    // 副标题
    subtitle: {
      type: String,
      value: '',
    },
    // 封面图片
    cover: {
      type: String,
      value: '',
    },
    // 标签
    tag: {
      type: String,
      value: '',
    },
    // 标签类型: primary, success, warning, danger
    tagType: {
      type: String,
      value: 'primary',
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      value: false,
    },
    // 是否选中
    selected: {
      type: Boolean,
      value: false,
    },
    // 是否显示边框
    bordered: {
      type: Boolean,
      value: false,
    },
    // 圆角大小: small, medium, large
    radius: {
      type: String,
      value: 'medium',
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
      if (!this.data.clickable) return;

      this.setData({ isPressed: true });
      setTimeout(() => {
        this.setData({ isPressed: false });
      }, 150);

      this.triggerEvent('click');
    },

    onLongPress() {
      if (!this.data.clickable) return;
      this.triggerEvent('longpress');
    },
  },
});