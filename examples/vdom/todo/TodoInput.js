// Next, an input component for adding new todos.
export const TodoInput = ({ input, setInput, addTodo }) => {
  // Handles user typing into the text field.
  const oninput = (e) => {
    setInput(e.target.value);
  };

  // Handles submitting the input.
  const onsubmit = (e) => {
    addTodo(input);
    setInput("");
    e.preventDefault();
  };

  return [
    "form",
    { onsubmit },
    [
      ["input", { type: "text", value: input, oninput }, []],
      ["button", { type: "submit" }, ["Add todo"]],
    ],
  ];
};
