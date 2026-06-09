/**
 * SkiHive Storage System
 * 存储封装 - 统一管理本地存储
 */


/**
 * 存储键名常量
 */
const STORAGE_KEYS = {
  USER_INFO: 'skihive_user_info',
  IS_LOGGED_IN: 'skihive_is_logged_in',
  GLOBAL_DATA: 'skihive_global_data',
  FLIGHT_RECORDS: 'skihive_flight_records',
  USERS: 'skihive_users',
  SETTINGS: 'skihive_settings',
  CURRENCY: 'skihive_currency',
  ACHIEVEMENTS: 'skihive_achievements',
  TUTORIAL_PROGRESS: 'skihive_tutorial_progress',
  SHOP_INVENTORY: 'skihive_shop_inventory',
  DAILY_REWARDS: 'skihive_daily_rewards',
  STORY_SECRET_UNLOCKED: 'skihive_story_secret_unlocked',
};

/**
 * 默认存储数据
 */
const DEFAULT_VALUES = {
  currency: 1000,
  achievements: [],
  tutorialProgress: 0,
  shopInventory: [],
  dailyRewards: {
    lastClaimDate: null,
    streak: 0,
  },
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    notificationsEnabled: true,
  },
};

/**
 * 存储工具类
 */
class Storage {
  constructor() {
    this.keys = STORAGE_KEYS;
  }

  /**
   * 获取数据
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   */
  get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key);
      return value !== '' ? value : defaultValue;
    } catch (e) {
      console.error(`[Storage] Get ${key} failed:`, e);
      return defaultValue;
    }
  }

  /**
   * 设置数据
   * @param {string} key - 键名
   * @param {*} value - 值
   */
  set(key, value) {
    try {
      wx.setStorageSync(key, value);
      return true;
    } catch (e) {
      console.error(`[Storage] Set ${key} failed:`, e);
      return false;
    }
  }

  /**
   * 删除数据
   * @param {string} key - 键名
   */
  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error(`[Storage] Remove ${key} failed:`, e);
      return false;
    }
  }

  /**
   * 清空所有存储
   */
  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('[Storage] Clear failed:', e);
      return false;
    }
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return this.get(STORAGE_KEYS.USER_INFO, null);
  }

  /**
   * 设置用户信息
   * @param {object} userInfo - 用户信息
   */
  setUserInfo(userInfo) {
    return this.set(STORAGE_KEYS.USER_INFO, userInfo);
  }

  /**
   * 获取登录状态
   */
  getLoginStatus() {
    return this.get(STORAGE_KEYS.IS_LOGGED_IN, false);
  }

  /**
   * 设置登录状态
   * @param {boolean} isLoggedIn - 是否登录
   */
  setLoginStatus(isLoggedIn) {
    return this.set(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  }

  /**
   * 获取飞行记录
   */
  getFlightRecords() {
    return this.get(STORAGE_KEYS.FLIGHT_RECORDS, []);
  }

  /**
   * 获取用户列表（注册用）
   */
  getUsers() {
    return this.get(STORAGE_KEYS.USERS, {});
  }

  /**
   * 设置用户列表
   * @param {object} users - 用户列表对象
   */
  setUsers(users) {
    return this.set(STORAGE_KEYS.USERS, users);
  }

  /**
   * 添加飞行记录
   * @param {object} record - 飞行记录
   */
  addFlightRecord(record) {
    const records = this.getFlightRecords();
    records.unshift({
      ...record,
      id: Date.now().toString(),
      createTime: new Date().toISOString(),
    });
    // 最多保留100条记录
    if (records.length > 100) {
      records.pop();
    }
    return this.set(STORAGE_KEYS.FLIGHT_RECORDS, records);
  }

  /**
   * 获取虚拟货币
   */
  getCurrency() {
    return this.get(STORAGE_KEYS.CURRENCY, DEFAULT_VALUES.currency);
  }

  /**
   * 设置虚拟货币
   * @param {number} amount - 货币数量
   */
  setCurrency(amount) {
    return this.set(STORAGE_KEYS.CURRENCY, Math.max(0, amount));
  }

  /**
   * 增加虚拟货币
   * @param {number} amount - 增加数量
   */
  addCurrency(amount) {
    const current = this.getCurrency();
    return this.setCurrency(current + amount);
  }

  /**
   * 扣除虚拟货币
   * @param {number} amount - 扣除数量
   */
  deductCurrency(amount) {
    const current = this.getCurrency();
    if (current < amount) {
      return false; // 余额不足
    }
    return this.setCurrency(current - amount);
  }

  /**
   * 获取成就列表
   */
  getAchievements() {
    return this.get(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_VALUES.achievements);
  }

  /**
   * 解锁成就
   * @param {string} achievementId - 成就ID
   */
  unlockAchievement(achievementId) {
    const achievements = this.getAchievements();
    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      this.set(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    }
    return achievements;
  }

  /**
   * 检查成就是否已解锁
   * @param {string} achievementId - 成就ID
   */
  hasAchievement(achievementId) {
    return this.getAchievements().includes(achievementId);
  }

  /**
   * 获取教程进度
   */
  getTutorialProgress() {
    return this.get(STORAGE_KEYS.TUTORIAL_PROGRESS, DEFAULT_VALUES.tutorialProgress);
  }

  /**
   * 设置教程进度
   * @param {number} progress - 进度值
   */
  setTutorialProgress(progress) {
    return this.set(STORAGE_KEYS.TUTORIAL_PROGRESS, progress);
  }

  /**
   * 完成教程步骤
   * @param {number} step - 步骤号
   */
  completeTutorialStep(step) {
    const current = this.getTutorialProgress();
    if (step > current) {
      return this.setTutorialProgress(step);
    }
    return true;
  }

  /**
   * 获取剧情章节完成状态（章节/隐藏结局解锁记录）
   * @returns {Object} { [chapterId]: true }
   */
  getStorySecretUnlocked() {
    return this.get(STORAGE_KEYS.STORY_SECRET_UNLOCKED, {});
  }

  /**
   * 持久化剧情章节完成状态
   * @param {Object} secretUnlocked - { [chapterId]: true }
   */
  setStorySecretUnlocked(secretUnlocked) {
    return this.set(STORAGE_KEYS.STORY_SECRET_UNLOCKED, secretUnlocked || {});
  }

  /**
   * 获取商店库存
   */
  getShopInventory() {
    return this.get(STORAGE_KEYS.SHOP_INVENTORY, DEFAULT_VALUES.shopInventory);
  }

  /**
   * 添加物品到库存
   * @param {string} itemId - 物品ID
   * @param {number} quantity - 数量
   */
  addToInventory(itemId, quantity = 1) {
    const inventory = this.getShopInventory();
    const existing = inventory.find(item => item.id === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      inventory.push({ id: itemId, quantity });
    }
    return this.set(STORAGE_KEYS.SHOP_INVENTORY, inventory);
  }

  /**
   * 检查是否拥有物品
   * @param {string} itemId - 物品ID
   */
  hasItem(itemId) {
    const inventory = this.getShopInventory();
    return inventory.some(item => item.id === itemId && item.quantity > 0);
  }

  /**
   * 获取每日奖励状态
   */
  getDailyRewards() {
    return this.get(STORAGE_KEYS.DAILY_REWARDS, DEFAULT_VALUES.dailyRewards);
  }

  /**
   * 领取每日奖励
   */
  claimDailyReward() {
    const rewards = this.getDailyRewards();
    const today = new Date().toDateString();
    const lastClaim = rewards.lastClaimDate;

    if (lastClaim === today) {
      return { success: false, message: '今日已领取' };
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const isStreak = lastClaim === yesterday;
    const newStreak = isStreak ? rewards.streak + 1 : 1;

    // 计算奖励
    const baseReward = 100;
    const streakBonus = Math.min(newStreak, 7) * 20;
    const totalReward = baseReward + streakBonus;

    this.addCurrency(totalReward);
    this.set(STORAGE_KEYS.DAILY_REWARDS, {
      lastClaimDate: today,
      streak: newStreak,
    });

    return {
      success: true,
      reward: totalReward,
      streak: newStreak,
      message: `连续${newStreak}天`,
    };
  }

  /**
   * 获取设置
   */
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, DEFAULT_VALUES.settings);
  }

  /**
   * 更新设置
   * @param {object} newSettings - 新设置
   */
  updateSettings(newSettings) {
    const current = this.getSettings();
    return this.set(STORAGE_KEYS.SETTINGS, { ...current, ...newSettings });
  }

  /**
   * 获取全局数据备份
   */
  getGlobalDataBackup() {
    return this.get(STORAGE_KEYS.GLOBAL_DATA, null);
  }

  /**
   * 保存全局数据备份
   * @param {object} globalData - 全局数据对象
   */
  setGlobalDataBackup(globalData) {
    return this.set(STORAGE_KEYS.GLOBAL_DATA, globalData);
  }
}

// 导出单例
const storage = new Storage();

module.exports = {
  storage,
  STORAGE_KEYS,
  DEFAULT_VALUES,
};