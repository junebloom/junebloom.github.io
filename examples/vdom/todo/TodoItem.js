// First, a todo item component.
// Clicking it marks it as complete.
export const TodoItem = ({ todo, completeTodo }) => [
  "li",
  { onclick: () => completeTodo(todo) },
  [todo],
];
