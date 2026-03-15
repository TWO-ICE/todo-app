import { useGame } from "../../contexts/GameContext";
import { getLevelConfig } from "../../config/gameConfig";

export function PlayerInfoBar() {
  const { gameData } = useGame();
  const levelConfig = getLevelConfig(gameData.level);
  const nextLevelConfig = getLevelConfig(gameData.level + 1);

  // 计算当前等级的 XP 进度
  const currentLevelXP = gameData.xp - levelConfig.xpRequired;
  const nextLevelXP = nextLevelConfig.xpRequired - levelConfig.xpRequired;
  const progress = (currentLevelXP / nextLevelXP) * 100;

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-2xl mb-6">
      <div className="flex items-center justify-between">
        {/* 左侧：等级和称号 */}
        <div className="flex items-center gap-4">
          <div className="text-5xl">{levelConfig.badge}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-indigo-200">Lv.{gameData.level}</span>
              <span className="text-2xl font-bold">{gameData.title}</span>
            </div>
            <div className="text-sm text-indigo-200 mt-1">
              已完成 {gameData.totalTasksCompleted} 个任务
            </div>
          </div>
        </div>

        {/* 右侧：XP 信息 */}
        <div className="flex-1 max-w-md ml-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">XP: {gameData.xp}</span>
            <span className="text-indigo-200">
              下一级: {nextLevelConfig.xpRequired}
            </span>
          </div>
          <div className="w-full bg-indigo-900/50 rounded-full h-4 overflow-hidden border-2 border-indigo-400/30">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          {gameData.comboCount > 0 && (
            <div className="mt-2 text-center">
              <span className="text-xs font-bold bg-orange-500 px-3 py-1 rounded-full">
                🔥 {gameData.comboCount} 连击！
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
