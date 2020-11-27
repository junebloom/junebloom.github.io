import { TodoInput } from "./TodoInput.js";
import { TodoItem } from "./TodoItem.js";

// And most importantly, a todo app component to put it all together.
export const TodoApp = (state, setState) => {
  // Updates the text input state.
  const setInput = (value) => {
    setState((state) => ({ ...state, input: value }));
  };

  // Adds a new todo item.
  const addTodo = (todo) => {
    setState((state) => ({ ...state, todos: [...state.todos, todo] }));
  };

  // Marks a todo item as complete.
  const completeTodo = (todo) => {
    setState((state) => ({
      ...state,
      todos: state.todos.filter((item) => item !== todo),
    }));
  };

  return [
    "main",
    {},
    [
      ["h1", {}, ["Todo"]],
      TodoInput({ input: state.input, setInput, addTodo }),
      ["ul", {}, state.todos.map((todo) => TodoItem({ todo, completeTodo }))],
    ],
  ];
};
