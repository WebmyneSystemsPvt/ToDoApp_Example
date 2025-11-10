export type TodoStatus = 'Pending' | 'Completed';

// todo interface for task item array
export interface Todo {
    id: string;
    title: string;
    description: string;
    status: TodoStatus;
    createdAt: string;
    dueDate: string
}
