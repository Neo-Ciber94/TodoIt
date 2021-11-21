import { ITodo } from "src/shared/todo.model";

export interface TodoNoteProps {
    todo: ITodo;
    completeTodo: () => void;
    deleteTodo: () => void;
}