import { useState, useMemo } from "react";
import { useTodos } from "./hooks/useTodos";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import type { Priority, Todo } from "./types/todo";
import { Plus, Trash2, Search, Check } from "lucide-react";

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

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

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            📝 Todo App
          </h1>

          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1 text-lg"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <Button type="submit" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </form>

          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search todos..."
                className="flex-1"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active ({stats.active})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Completed ({stats.completed})
              </Button>
            </div>

            <div className="flex gap-2">
              <span className="text-sm text-gray-600 py-2">Priority:</span>
              <Button
                variant={priorityFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityFilter("all")}
              >
                All
              </Button>
              <Button
                variant={priorityFilter === "high" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityFilter("high")}
              >
                High
              </Button>
              <Button
                variant={priorityFilter === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityFilter("medium")}
              >
                Medium
              </Button>
              <Button
                variant={priorityFilter === "low" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityFilter("low")}
              >
                Low
              </Button>
            </div>
          </div>

          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))}
          </ul>

          {filteredTodos.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              {search || filter !== "all" || priorityFilter !== "all"
                ? "No todos match your filters"
                : "No todos yet. Add one above!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    high: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <li
      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
        todo.completed
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-blue-500"
        }`}
      >
        {todo.completed && <Check className="h-4 w-4" />}
      </button>

      <span
        className={`px-2 py-1 text-xs rounded-md border flex-shrink-0 ${
          priorityColors[todo.priority]
        }`}
      >
        {todo.priority}
      </span>

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditText(todo.text);
                setIsEditing(false);
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditText(todo.text);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <span
          className={`flex-1 text-lg ${
            todo.completed
              ? "line-through text-gray-400"
              : "text-gray-800"
          }`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}

      <Button
        size="icon"
        variant="ghost"
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </li>
  );
}

export default App;
