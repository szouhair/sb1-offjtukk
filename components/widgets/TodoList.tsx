"use client";

import { useState, useEffect } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TodoItem } from '@/types';
import { saveTodos, getTodos } from '@/lib/supabase/widgets';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface TodoListProps {
  widgetId: string;
}

export default function TodoList({ widgetId }: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from Supabase
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos(widgetId);
        if (data) {
          setTodos(data);
        }
      } catch (error) {
        toast.error('Failed to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [widgetId]);

  // Save todos to Supabase
  const handleSaveTodos = async (updatedTodos: TodoItem[]) => {
    try {
      await saveTodos(widgetId, updatedTodos);
    } catch (error) {
      toast.error('Failed to save todos');
    }
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const newItem: TodoItem = {
      id: uuidv4(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedTodos = [...todos, newItem];
    setTodos(updatedTodos);
    handleSaveTodos(updatedTodos);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    handleSaveTodos(updatedTodos);
  };

  const removeTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    handleSaveTodos(updatedTodos);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Input
          placeholder="Add a new task..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          className="text-sm"
        />
        <Button size="sm" onClick={addTodo} className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {todos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No tasks yet</p>
        </div>
      ) : (
        <ul className="space-y-2 overflow-y-auto flex-1">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2 group">
              <div className="flex-1 flex items-start gap-2">
                <Checkbox 
                  id={todo.id} 
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <label
                  htmlFor={todo.id}
                  className={`text-sm flex-1 ${
                    todo.completed ? 'text-muted-foreground line-through' : ''
                  }`}
                >
                  {todo.text}
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeTodo(todo.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}