import { TodoInput } from "./TodoInput.js";
import { TodoItem } from "./TodoItem.js";

// And most importantly, a todo app component to put it all together.
export const TodoApp = (getState, setState) => {
  // Updates the text input state.
  const setInput = (value) => {
    const state = getState();
    setState({ ...state, input: value });
  };

  // Adds a new todo item.
  const addTodo = (todo) => {
    const state = getState();
    setState({ ...state, todos: [...state.todos, todo] });
  };

  // Marks a todo item as complete.
  const completeTodo = (todo) => {
    const state = getState();
    setState({
      ...state,
      todos: state.todos.filter((item) => item !== todo),
    });
  };

  const state = getState();

  return [
    "main",
    {},
    [
      ["h1", {}, ["Todos"]],
      TodoInput({ input: state.input, setInput, addTodo }),
      ["ul", {}, state.todos.map((todo) => TodoItem({ todo, completeTodo }))],
    ],
  ];
};
