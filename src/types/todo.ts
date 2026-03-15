import type { Rarity } from "./game";

export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  // 游戏化字段
  rarity: Rarity;
  xpReward: number;
  completedAt?: number;
}
