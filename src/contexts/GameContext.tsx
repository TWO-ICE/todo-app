import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { GameData, Fragment, Achievement } from "../types/game";
import { calculateLevel, getLevelConfig } from "../config/gameConfig";

const GAME_STORAGE_KEY = "todoGame";
const INITIAL_GAME_DATA: GameData = {
  xp: 0,
  level: 1,
  title: "冒险学徒",
  badges: ["🌱"],
  achievements: [],
  fragments: [],
  puzzleProgress: [],
  comboCount: 0,
  lastLoginDate: "",
  totalTasksCompleted: 0,
  totalSSRObtained: 0,
  totalPlayDays: 0,
};

interface GameContextType {
  gameData: GameData;
  addXP: (amount: number) => void;
  addFragment: (fragment: Fragment) => void;
  checkPuzzleCompletion: (theme: string) => boolean;
  addAchievement: (achievement: Achievement) => void;
  updateComboCount: (count: number) => void;
  checkDailyLogin: () => boolean;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameData, setGameData] = useState<GameData>(INITIAL_GAME_DATA);
  const [isInitialized, setIsInitialized] = useState(false);

  // 从 LocalStorage 加载游戏数据
  useEffect(() => {
    const stored = localStorage.getItem(GAME_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGameData(parsed);
      } catch (e) {
        console.error("Failed to parse game data", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 保存到 LocalStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(gameData));
    }
  }, [gameData, isInitialized]);

  // 添加 XP 并检查升级
  const addXP = (amount: number) => {
    setGameData((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      const levelConfig = getLevelConfig(newLevel);

      // 检查是否升级
      if (newLevel > prev.level) {
        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          title: levelConfig.title,
          badges: [...prev.badges, levelConfig.badge],
        };
      }

      return {
        ...prev,
        xp: newXP,
      };
    });
  };

  // 添加碎片
  const addFragment = (fragment: Fragment) => {
    setGameData((prev) => {
      // 检查是否已存在
      if (prev.fragments.some((f) => f.id === fragment.id)) {
        return prev;
      }

      const newFragments = [...prev.fragments, fragment];

      // 更新拼图进度
      const newPuzzleProgress = prev.puzzleProgress.map((progress) => {
        if (progress.theme === fragment.theme) {
          const newCollected = [...new Set([...progress.collected, fragment.index])];
          const completed = newCollected.length === 9;

          return {
            ...progress,
            collected: newCollected,
            completed,
            completedAt: completed ? Date.now() : progress.completedAt,
          };
        }
        return progress;
      });

      // 如果拼图进度不存在，创建新的
      if (!newPuzzleProgress.some((p) => p.theme === fragment.theme)) {
        newPuzzleProgress.push({
          theme: fragment.theme,
          collected: [fragment.index],
          completed: false,
        });
      }

      return {
        ...prev,
        fragments: newFragments,
        puzzleProgress: newPuzzleProgress,
      };
    });
  };

  // 检查拼图是否完成
  const checkPuzzleCompletion = (theme: string): boolean => {
    const progress = gameData.puzzleProgress.find((p) => p.theme === theme);
    return progress?.completed || false;
  };

  // 添加成就
  const addAchievement = (achievement: Achievement) => {
    setGameData((prev) => {
      // 检查是否已存在
      if (prev.achievements.some((a) => a.id === achievement.id)) {
        return prev;
      }

      return {
        ...prev,
        achievements: [...prev.achievements, { ...achievement, unlocked: true, unlockedAt: Date.now() }],
      };
    });
  };

  // 更新连击数
  const updateComboCount = (count: number) => {
    setGameData((prev) => ({
      ...prev,
      comboCount: count,
    }));
  };

  // 检查每日登录
  const checkDailyLogin = (): boolean => {
    const today = new Date().toISOString().split("T")[0];
    const lastLogin = gameData.lastLoginDate;

    if (lastLogin !== today) {
      setGameData((prev) => ({
        ...prev,
        lastLoginDate: today,
        totalPlayDays: prev.totalPlayDays + 1,
      }));
      return true;
    }

    return false;
  };

  // 重置游戏数据
  const resetGame = () => {
    setGameData(INITIAL_GAME_DATA);
    localStorage.removeItem(GAME_STORAGE_KEY);
  };

  return (
    <GameContext.Provider
      value={{
        gameData,
        addXP,
        addFragment,
        checkPuzzleCompletion,
        addAchievement,
        updateComboCount,
        checkDailyLogin,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
