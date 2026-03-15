import type { LevelConfig, RarityConfig, PuzzleThemeConfig, ComboConfig } from "../types/game";

// 等级配置表 (1-15级)
export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, xpRequired: 0, title: "冒险学徒", badge: "🌱", unlockReward: "基础功能" },
  { level: 2, xpRequired: 100, title: "见习勇者", badge: "🌿", unlockReward: "解锁碎片收集" },
  { level: 3, xpRequired: 300, title: "正式勇者", badge: "🌳", unlockReward: "解锁第一套拼图" },
  { level: 4, xpRequired: 600, title: "资深勇者", badge: "🏅", unlockReward: "R级副本+10% XP" },
  { level: 5, xpRequired: 1000, title: "精英勇者", badge: "⭐️", unlockReward: "SR级副本+10% XP" },
  { level: 6, xpRequired: 1500, title: "勇者大师", badge: "💎", unlockReward: "解锁第二套拼图" },
  { level: 7, xpRequired: 2100, title: "冒险家", badge: "🎖️", unlockReward: "每日登录奖励" },
  { level: 8, xpRequired: 2800, title: "探险家", badge: "🏆", unlockReward: "解锁第三套拼图" },
  { level: 9, xpRequired: 3600, title: "传奇勇者", badge: "👑", unlockReward: "SSR级副本+10% XP" },
  { level: 10, xpRequired: 4500, title: "英雄", badge: "🦸", unlockReward: "解锁第四套拼图" },
  { level: 11, xpRequired: 5500, title: "传奇英雄", badge: "🦹‍♂️", unlockReward: "自定义称号" },
  { level: 12, xpRequired: 6600, title: "圣者", badge: "🌟", unlockReward: "解锁彩虹拼图" },
  { level: 13, xpRequired: 7800, title: "贤者", badge: "💫", unlockReward: "连击加成上限提升" },
  { level: 14, xpRequired: 9000, title: "半神", badge: "⚡", unlockReward: "全部副本+15% XP" },
  { level: 15, xpRequired: 10500, title: "冒险之神", badge: "🏅✨", unlockReward: "终极徽章+特效" },
];

// 副本稀有度配置
export const RARITY_CONFIGS: Record<string, RarityConfig> = {
  N: {
    rarity: "N",
    name: "Normal",
    xpReward: 10,
    color: "#10b981", // 绿色
    borderColor: "#059669",
    icon: "⬜",
  },
  R: {
    rarity: "R",
    name: "Rare",
    xpReward: 25,
    color: "#3b82f6", // 蓝色
    borderColor: "#2563eb",
    icon: "🔷",
  },
  SR: {
    rarity: "SR",
    name: "Super Rare",
    xpReward: 50,
    color: "#a855f7", // 紫色
    borderColor: "#9333ea",
    icon: "🔶",
  },
  SSR: {
    rarity: "SSR",
    name: "Super Super Rare",
    xpReward: 100,
    color: "#f59e0b", // 金色
    borderColor: "#d97706",
    icon: "🌟",
  },
};

// 拼图主题配置
export const PUZZLE_THEME_CONFIGS: Record<string, PuzzleThemeConfig> = {
  spring: {
    theme: "spring",
    name: "春日樱花",
    emoji: "🌸",
    color: "#10b981",
    fragmentCount: 9,
    unlockLevel: 3,
    bonusXP: 200,
  },
  summer: {
    theme: "summer",
    name: "夏日海浪",
    emoji: "🌊",
    color: "#3b82f6",
    fragmentCount: 9,
    unlockLevel: 6,
    bonusXP: 200,
  },
  autumn: {
    theme: "autumn",
    name: "秋日枫叶",
    emoji: "🍁",
    color: "#f97316",
    fragmentCount: 9,
    unlockLevel: 8,
    bonusXP: 200,
  },
  winter: {
    theme: "winter",
    name: "冬日雪花",
    emoji: "❄️",
    color: "#e5e7eb",
    fragmentCount: 9,
    unlockLevel: 10,
    bonusXP: 200,
  },
  rainbow: {
    theme: "rainbow",
    name: "彩虹梦境",
    emoji: "🌈",
    color: "#ec4899",
    fragmentCount: 9,
    unlockLevel: 12,
    bonusXP: 200,
  },
};

// 连击配置
export const COMBO_CONFIGS: ComboConfig[] = [
  { count: 2, bonus: 0.2 }, // 2连击 +20%
  { count: 3, bonus: 0.3 }, // 3连击 +30%
  { count: 4, bonus: 0.4 }, // 4连击 +40%
  { count: 5, bonus: 0.5 }, // 5连击 +50%
];

// 根据总 XP 计算等级
export function calculateLevel(totalXP: number): number {
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_CONFIGS[i].xpRequired) {
      return LEVEL_CONFIGS[i].level;
    }
  }
  return 1;
}

// 根据等级获取配置
export function getLevelConfig(level: number): LevelConfig {
  return LEVEL_CONFIGS.find((config) => config.level === level) || LEVEL_CONFIGS[0];
}

// 根据优先级映射到稀有度
export function mapPriorityToRarity(priority: string): "N" | "R" | "SR" {
  switch (priority) {
    case "low":
      return "N";
    case "medium":
      return "R";
    case "high":
      return "SR";
    default:
      return "N";
  }
}

// 检查是否触发 SSR（连续完成3个以上任务）
export function checkSSR(comboCount: number): boolean {
  return comboCount >= 3;
}

// 计算连击加成
export function calculateComboBonus(comboCount: number): number {
  for (let i = COMBO_CONFIGS.length - 1; i >= 0; i--) {
    if (comboCount >= COMBO_CONFIGS[i].count) {
      return COMBO_CONFIGS[i].bonus;
    }
  }
  return 0;
}

// 计算最终 XP 奖励（含连击加成）
export function calculateXPReward(
  baseXP: number,
  comboCount: number,
  level: number
): number {
  let xp = baseXP;
  const comboBonus = calculateComboBonus(comboCount);
  xp = Math.floor(xp * (1 + comboBonus));

  // 等级加成
  if (level >= 4) xp = Math.floor(xp * 1.1); // R级+10%
  if (level >= 5) xp = Math.floor(xp * 1.1); // SR级+10%
  if (level >= 9) xp = Math.floor(xp * 1.1); // SSR级+10%
  if (level >= 14) xp = Math.floor(xp * 1.15); // 全部+15%

  return xp;
}
