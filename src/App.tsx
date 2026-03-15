import { useState, useMemo, useEffect } from "react";
import { useTodos } from "./hooks/useTodos";
import { useGameLogic } from "./hooks/useGameLogic";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { PlayerInfoBar } from "./components/game/PlayerInfoBar";
import { TodoCard } from "./components/game/TodoCard";
import type { Priority } from "./types/todo";
import { Plus, Search, BookOpen, Trophy } from "lucide-react";

function App() {
  const { todos, addTodo, deleteTodo, updateTodo } = useTodos();
  const { handleCompleteTask, handleUncompleteTask, gameData } = useGameLogic();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [activeTab, setActiveTab] = useState<"tasks" | "collection" | "achievements">("tasks");

  // 重置连击计数器
  useEffect(() => {
    const interval = setInterval(() => {
      const lastCompleted = gameData.lastCompletedAt;
      if (lastCompleted && Date.now() - lastCompleted > 5 * 60 * 1000) {
        // 超过5分钟，这里可以添加重置连击的逻辑
      }
    }, 60000); // 每分钟检查一次

    return () => clearInterval(interval);
  }, [gameData.lastCompletedAt]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.text
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        filter === "all" ||
        (filter === "active" && !todo.completed) ||
        (filter === "completed" && todo.completed);
      const matchesPriority =
        priorityFilter === "all" || todo.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [todos, search, filter, priorityFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim(), priority);
      setText("");
      setPriority("medium");
    }
  };

  const handleToggle = (todoId: string) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;

    if (!todo.completed) {
      handleCompleteTask(todoId);
    } else {
      handleUncompleteTask(todoId);
    }
  };

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 玩家信息栏 */}
        <PlayerInfoBar />

        {/* 主内容区域 */}
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-6">
          {/* 导航标签 */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === "tasks"
                  ? "text-purple-600 border-b-4 border-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              📋 副本列表
            </button>
            <button
              onClick={() => setActiveTab("collection")}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === "collection"
                  ? "text-purple-600 border-b-4 border-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <BookOpen className="h-5 w-5 inline mr-2" />
              图鉴
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === "achievements"
                  ? "text-purple-600 border-b-4 border-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Trophy className="h-5 w-5 inline mr-2" />
              成就
            </button>
          </div>

          {/* 副本列表标签页 */}
          {activeTab === "tasks" && (
            <>
              {/* 添加任务表单 */}
              <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="🎯 添加新副本..."
                    className="flex-1 text-lg"
                  />
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">🟢 N级（低优先级）</option>
                    <option value="medium">🔵 R级（中优先级）</option>
                    <option value="high">🟣 SR级（高优先级）</option>
                  </select>
                  <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              {/* 搜索和筛选 */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 搜索副本..."
                    className="flex-1"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    全部 ({stats.total})
                  </Button>
                  <Button
                    variant={filter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("active")}
                    className={filter === "active" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    进行中 ({stats.active})
                  </Button>
                  <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("completed")}
                    className={filter === "completed" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    已完成 ({stats.completed})
                  </Button>
                </div>

                <div className="flex gap-2">
                  <span className="text-sm text-gray-600 py-2">稀有度:</span>
                  <Button
                    variant={priorityFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriorityFilter("all")}
                    className={priorityFilter === "all" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    全部
                  </Button>
                  <Button
                    variant={priorityFilter === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriorityFilter("high")}
                    className={priorityFilter === "high" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    SR级
                  </Button>
                  <Button
                    variant={priorityFilter === "medium" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriorityFilter("medium")}
                    className={priorityFilter === "medium" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    R级
                  </Button>
                  <Button
                    variant={priorityFilter === "low" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriorityFilter("low")}
                    className={priorityFilter === "low" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    N级
                  </Button>
                </div>
              </div>

              {/* 任务列表 */}
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                  />
                ))}
              </div>

              {filteredTodos.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏰</div>
                  <p className="text-gray-500 text-lg">
                    {search || filter !== "all" || priorityFilter !== "all"
                      ? "没有找到匹配的副本"
                      : "还没有副本，去创建一个吧！"}
                  </p>
                </div>
              )}
            </>
          )}

          {/* 图鉴标签页 */}
          {activeTab === "collection" && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">图鉴系统</h3>
              <p className="text-gray-600">拼图收集功能即将推出...</p>
              <p className="text-sm text-gray-500 mt-2">
                已收集 {gameData.fragments.length} 个碎片
              </p>
            </div>
          )}

          {/* 成就标签页 */}
          {activeTab === "achievements" && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">成就系统</h3>
              <p className="text-gray-600">成就系统即将推出...</p>
              <p className="text-sm text-gray-500 mt-2">
                已解锁 {gameData.achievements.length} 个成就
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
