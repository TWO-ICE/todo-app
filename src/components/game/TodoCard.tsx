import { useState } from "react";
import type { Todo } from "../../types/todo";
import { Check, Trash2, Edit2 } from "lucide-react";
import { RARITY_CONFIGS } from "../../config/gameConfig";

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onComplete?: (todo: Todo) => void;
}

export function TodoCard({ todo, onToggle, onDelete, onUpdate, onComplete }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showAnimation, setShowAnimation] = useState(false);

  const rarityConfig = RARITY_CONFIGS[todo.rarity];

  const handleToggle = () => {
    if (!todo.completed) {
      setShowAnimation(true);
      if (onComplete) onComplete(todo);
      setTimeout(() => setShowAnimation(false), 2000);
    }
    onToggle(todo.id);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`relative transition-all duration-300 ${
        showAnimation ? "animate-completion" : ""
      } ${todo.completed ? "opacity-60" : ""}`}
    >
      {/* 副本卡片 */}
      <div
        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
          todo.completed
            ? "bg-gray-50 border-gray-200"
            : `bg-white hover:shadow-lg hover:scale-[1.02]`
        }`}
        style={
          !todo.completed
            ? {
                borderColor: rarityConfig.borderColor,
                boxShadow: `0 0 10px ${rarityConfig.color}20`,
              }
            : {}
        }
      >
        <div className="flex items-center gap-3">
          {/* 完成按钮 */}
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
              todo.completed
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-blue-500"
            }`}
            style={!todo.completed ? { borderColor: rarityConfig.borderColor } : {}}
          >
            {todo.completed && <Check className="h-5 w-5" />}
          </button>

          {/* 稀有度徽章 */}
          <div
            className={`px-3 py-1 rounded-md text-sm font-bold border-2 flex-shrink-0`}
            style={{
              backgroundColor: rarityConfig.color,
              borderColor: rarityConfig.borderColor,
              color: "white",
            }}
          >
            {rarityConfig.icon} {todo.rarity}
          </div>

          {/* 任务内容 */}
          {isEditing ? (
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") {
                    setEditText(todo.text);
                    setIsEditing(false);
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setEditText(todo.text);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          ) : (
            <div className="flex-1">
              <p
                className={`text-lg ${
                  todo.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
                onDoubleClick={() => setIsEditing(true)}
              >
                {todo.text}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  优先级: {todo.priority}
                </span>
                <span className="text-xs font-bold" style={{ color: rarityConfig.color }}>
                  +{todo.xpReward} XP
                </span>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {!isEditing && !todo.completed && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 完成动画 */}
        {showAnimation && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-2xl font-bold animate-bounce" style={{ color: rarityConfig.color }}>
              +{todo.xpReward} XP
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
