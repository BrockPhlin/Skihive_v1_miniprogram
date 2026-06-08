/**
 * 密码哈希工具（用于本地存储密码的安全哈希）
 *
 * 注意：
 * 1. 本实现不是真正的 SHA-256，而是一个基于 FNV-1a 的多轮迭代哈希。
 *    函数名沿用历史叫法 `sha256`，仅作向后兼容，新代码请使用 `hashPassword`。
 * 2. 本地存储密码本来就属于"防御性哈希"（防止明文落盘），
 *    不要把它用于需要密码学强度的场景（如 token 签名）。
 * 3. 生产环境建议替换为 `crypto-js` 等成熟实现。
 */

const SALT = 'skihive_salt_2024'

/**
 * 对字符串执行多轮迭代哈希，输出 24 位十六进制摘要。
 * @param {string} message 待哈希字符串
 * @param {string} [salt] 盐值，默认使用项目固定盐
 * @returns {string} 24 位十六进制字符串
 */
function hashPassword(message, salt = SALT) {
  const combined = message + salt

  // 第一轮：FNV-1a hash
  let h = 2166136261
  for (let i = 0; i < combined.length; i++) {
    h ^= combined.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }

  // 第二轮：混合哈希
  let hash = 0
  for (let i = 0; i < message.length; i++) {
    hash = ((hash << 5) - hash + message.charCodeAt(i)) >>> 0
  }

  // 多轮迭代增强（类似 PBKDF2 的工作因子）
  let result = h ^ hash
  for (let i = 0; i < 1000; i++) {
    result = ((result << 5) - result + (h & 0xFFFF) + (hash & 0xFFFF)) >>> 0
    h = (h * 16777619 + i) >>> 0
    hash = (hash ^ ((result * 31 + i) >>> 0)) >>> 0
  }

  const part1 = result.toString(16).padStart(8, '0')
  const part2 = h.toString(16).padStart(8, '0')
  const part3 = hash.toString(16).padStart(8, '0')

  return (part1 + part2 + part3).toUpperCase()
}

/**
 * 验证密码哈希是否匹配。
 * @param {string} inputPassword 用户输入的明文密码
 * @param {string} storedHash 已存储的哈希值
 * @returns {boolean}
 */
function verifyPassword(inputPassword, storedHash) {
  return hashPassword(inputPassword) === storedHash
}

// 向后兼容：旧调用使用 `sha256`，保留别名
const sha256 = hashPassword

module.exports = {
  hashPassword,
  sha256,
  verifyPassword
}
