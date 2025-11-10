import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoStatus } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// ✅ Interface for the Todo slice state
interface TodoState {
  todos: Todo[]; // Array of all todo items
}

// ✅ Initial state of the slice
const initialState: TodoState = {
  todos: [],
};

// ✅ Payload interface for adding a new todo
interface AddTodoPayload {
  title: string;
  description: string;
  dueDate: string;
}

// ✅ Payload interface for updating the status of a todo
interface UpdateStatusPayload {
  id: string;
  status: TodoStatus;
}

// ✅ Create the todo slice using Redux Toolkit
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // ✅ Add a new todo
    addTodo: (state, action: PayloadAction<AddTodoPayload>) => {
      const newTodo: Todo = {
        id: uuidv4(),                     // Unique ID for the todo
        title: action.payload.title,
        description: action.payload.description,
        status: 'Pending',                // Default status
        createdAt: new Date().toISOString(),
        dueDate: action.payload.dueDate,
      };
      state.todos.push(newTodo);          // Add to state
    },

    // ✅ Delete a todo by ID
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },

    // ✅ Replace all todos (useful for initializing from persisted state)
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },

    // ✅ Update title, description, and dueDate of an existing todo
    updateTodo: (state, action) => {
      const { id, title, description, dueDate } = action.payload;
      const existing = state.todos.find(todo => todo.id === id);
      if (existing) {
        existing.title = title;
        existing.description = description;
        existing.dueDate = dueDate;
      }
    },

    // ✅ Update the status of a todo (Pending / Completed)
    updateTodoStatus: (state, action: PayloadAction<UpdateStatusPayload>) => {
      const { id, status } = action.payload;
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.status = status;
      }
    },

    // ✅ Toggle status of a todo (Pending ↔ Completed)
    toggleTodoStatus: (state, action) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
      }
    },
  },
});

// ✅ Export actions for dispatching
export const { addTodo, deleteTodo, setTodos, updateTodo, updateTodoStatus, toggleTodoStatus } = todoSlice.actions;

// ✅ Export reducer to include in the store
export default todoSlice.reducer;
