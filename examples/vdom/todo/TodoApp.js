import { TodoInput } from "./TodoInput.js";
import { TodoItem } from "./TodoItem.js";

// And most importantly, a todo app component to put it all together.
export const TodoApp = (getState, setState) => {
  // Updates the text input state.
  const setInput = (value) => {
    setState({ ...getState(), input: value });
  };

  // Adds a new todo item.
  const addTodo = (todo) => {
    setState({ ...getState(), todos: [...getState().todos, todo] });
  };

  // Marks a todo item as complete.
  const completeTodo = (todo) => {
    setState({
      ...getState(),
      todos: getState().todos.filter((item) => item !== todo),
    });
  };

  return [
    "main",
    {},
    [
      ["h1", {}, ["Todos"]],
      TodoInput({ input: getState().input, setInput, addTodo }),
      [
        "ul",
        {},
        getState().todos.map((todo) => TodoItem({ todo, completeTodo })),
      ],
    ],
  ];
};
