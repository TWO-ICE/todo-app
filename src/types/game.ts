// 游戏化数据类型定义

// 副本稀有度
export type Rarity = "N" | "R" | "SR" | "SSR";

// 碎片稀有度
export type FragmentRarity = "common" | "rare" | "epic";

// 拼图主题
export type PuzzleTheme = "spring" | "summer" | "autumn" | "winter" | "rainbow";

// 称号
export type Title =
  | "冒险学徒"
  | "见习勇者"
  | "正式勇者"
  | "资深勇者"
  | "精英勇者"
  | "勇者大师"
  | "冒险家"
  | "探险家"
  | "传奇勇者"
  | "英雄"
  | "传奇英雄"
  | "圣者"
  | "贤者"
  | "半神"
  | "冒险之神";

// 碎片数据
export interface Fragment {
  id: string;
  theme: PuzzleTheme;
  index: number; // 1-9
  obtainedAt: number;
  rarity: FragmentRarity;
}

// 拼图进度
export interface PuzzleProgress {
  theme: PuzzleTheme;
  collected: number[]; // 已收集的碎片索引 (1-9)
  completed: boolean;
  completedAt?: number;
}

// 成就类型
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  target?: number;
}

// 游戏数据
export interface GameData {
  xp: number;
  level: number;
  title: Title;
  badges: string[];
  achievements: Achievement[];
  fragments: Fragment[];
  puzzleProgress: PuzzleProgress[];
  comboCount: number;
  lastCompletedAt?: number;
  lastLoginDate: string;
  totalTasksCompleted: number;
  totalSSRObtained: number;
  totalPlayDays: number;
}

// 等级配置
export interface LevelConfig {
  level: number;
  xpRequired: number;
  title: Title;
  badge: string;
  unlockReward: string;
}

// 副本配置
export interface RarityConfig {
  rarity: Rarity;
  name: string;
  xpReward: number;
  color: string;
  borderColor: string;
  icon: string;
}

// 拼图主题配置
export interface PuzzleThemeConfig {
  theme: PuzzleTheme;
  name: string;
  emoji: string;
  color: string;
  fragmentCount: number;
  unlockLevel: number;
  bonusXP: number;
}

// 连击配置
export interface ComboConfig {
  count: number;
  bonus: number;
}
