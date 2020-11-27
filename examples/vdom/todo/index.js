import { updateDom } from "../updateDom.js";
import { TodoApp } from "./TodoApp.js";

// Set up the app internals for mounting to the DOM and handling updates.
const app = {
  // This is the DOM element to mount the VDOM to.
  root: document.getElementById("app"),

  // This is a functional component that returns the VDOM tree for our app.
  // (We'll define it below.)
  component: TodoApp,

  // For state, we'll just use an object.
  state: {
    todos: ["code a vdom"],
    input: "",
  },

  // Store our VDOM so we can diff it when we perform updates.
  vdom: null,
};

// Renders the app's VDOM and updates the real DOM to match.
function render() {
  // Compute the VDOM.
  const previous = app.vdom;
  app.vdom = app.component(app.state, setState);

  // Update the real DOM.
  updateDom(previous, app.vdom, app.root, 0);
}

// Updates the state and triggers a render.
function setState(callback) {
  app.state = callback(app.state);
  render();
}

// Perform the initial render.
render();
