import { useCallback } from "react";
import { useGame } from "../contexts/GameContext";
import { useTodos } from "./useTodos";
import type { Fragment } from "../types/game";
import {
  checkSSR,
  calculateXPReward,
  PUZZLE_THEME_CONFIGS,
  RARITY_CONFIGS,
} from "../config/gameConfig";

// 碎片掉落配置
const FRAGMENT_DROP_RATES = {
  N: { min: 1, max: 1, rareChance: 0 }, // N级必掉1个普通碎片
  R: { min: 1, max: 2, rareChance: 0.2 }, // R级1-2个，20%稀有
  SR: { min: 1, max: 3, rareChance: 0.4 }, // SR级1-3个，40%稀有
  SSR: { min: 2, max: 3, rareChance: 0.8 }, // SSR级2-3个，80%稀有
};

// 可用的拼图主题（根据等级解锁）
function getAvailableThemes(level: number): string[] {
  return Object.entries(PUZZLE_THEME_CONFIGS)
    .filter(([_, config]) => level >= config.unlockLevel)
    .map(([theme]) => theme);
}

// 生成随机碎片
function generateFragment(
  level: number,
  rarity: "N" | "R" | "SR" | "SSR"
): Fragment | null {
  const availableThemes = getAvailableThemes(level);
  if (availableThemes.length === 0) return null;

  const theme = availableThemes[Math.floor(Math.random() * availableThemes.length)] as any;
  const index = Math.floor(Math.random() * 9) + 1; // 1-9
  const dropConfig = FRAGMENT_DROP_RATES[rarity];

  // 决定碎片稀有度
  const isRare = Math.random() < dropConfig.rareChance;
  let fragmentRarity: "common" | "rare" | "epic" = isRare ? "rare" : "common";
  
  if (rarity === "SSR" && Math.random() < 0.5) {
    fragmentRarity = "epic";
  }

  return {
    id: crypto.randomUUID(),
    theme,
    index,
    obtainedAt: Date.now(),
    rarity: fragmentRarity,
  };
}

// 生成多个碎片
function generateFragments(
  level: number,
  rarity: "N" | "R" | "SR" | "SSR",
  count: number
): Fragment[] {
  const fragments: Fragment[] = [];
  for (let i = 0; i < count; i++) {
    const fragment = generateFragment(level, rarity);
    if (fragment) fragments.push(fragment);
  }
  return fragments;
}

export function useGameLogic() {
  const { gameData, addXP, addFragment, updateComboCount } = useGame();
  const { todos, toggleTodo, getRecentCompleted } = useTodos();

  // 处理完成任务
  const handleCompleteTask = useCallback(
    (todoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo || todo.completed) return { xpGained: 0, fragments: [], isSSR: false, comboCount: 0 };

      // 计算连击
      const recentCompleted = getRecentCompleted(5); // 5分钟内
      const comboCount = recentCompleted.length + 1;

      // 检查是否触发 SSR
      const isSSR = checkSSR(comboCount);
      const finalRarity = isSSR ? "SSR" : todo.rarity;

      // 计算 XP 奖励
      const baseXP = isSSR ? RARITY_CONFIGS.SSR.xpReward : todo.xpReward;
      const xpGained = calculateXPReward(baseXP, comboCount, gameData.level);

      // 切换任务状态
      toggleTodo(todoId);

      // 添加 XP
      addXP(xpGained);

      // 更新连击数
      updateComboCount(comboCount);

      // 生成碎片掉落
      const dropConfig = FRAGMENT_DROP_RATES[finalRarity];
      const fragmentCount =
        Math.floor(Math.random() * (dropConfig.max - dropConfig.min + 1)) + dropConfig.min;
      const fragments = generateFragments(gameData.level, finalRarity, fragmentCount);

      // 添加碎片
      fragments.forEach((fragment) => addFragment(fragment));

      return {
        xpGained,
        fragments,
        isSSR,
        comboCount,
      };
    },
    [todos, gameData.level, addXP, addFragment, updateComboCount, toggleTodo, getRecentCompleted]
  );

  // 处理取消完成任务
  const handleUncompleteTask = useCallback(
    (todoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo || !todo.completed) return;

      // 直接切换状态，不扣除 XP
      toggleTodo(todoId);
    },
    [todos, toggleTodo]
  );

  // 重置连击（超过5分钟没有完成任务）
  const resetCombo = useCallback(() => {
    updateComboCount(0);
  }, [updateComboCount]);

  return {
    handleCompleteTask,
    handleUncompleteTask,
    resetCombo,
    gameData,
  };
}
