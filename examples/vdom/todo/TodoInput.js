// Next, an input component for adding new todos.
export const TodoInput = ({ input, setInput, addTodo }) => {
  // Handles user typing into the text field.
  const oninput = (e) => setInput(e.target.value);

  // Handles clicking the add button.
  const onclick = () => {
    addTodo(input);
    setInput("");
  };

  return [
    "div",
    {},
    [
      ["input", { type: "text", value: input, oninput }, []],
      ["button", { onclick }, ["Add todo"]],
    ],
  ];
};
