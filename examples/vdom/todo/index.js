import { updateDom } from "../updateDom.js";
import { TodoApp } from "./TodoApp.js";

// Mount the VDOM to the page, and set up state and render updates.
const app = {
  // This is the root DOM element to mount the VDOM to.
  root: document.getElementById("app"),

  // This is a function that returns the VDOM tree for our app.
  // (We'll define it below.)
  component: TodoApp,

  // For state, we'll just use an object.
  state: {
    todos: [],
    input: "",
  },

  // Store our VDOM so we can diff it when we perform updates.
  vdom: null,
};

// Renders the app's VDOM and update the real DOM to match.
function render() {
  // Compute the VDOM.
  const oldVdom = app.vdom;
  app.vdom = app.component(getState, setState);

  // Update the real DOM.
  updateDom(oldVdom, app.vdom, app.root, 0);
}

// Gets the freshest state, because closures can cause it to be stale if
// referenced directly.
function getState() {
  return app.state;
}

// Updates the state and trigger a render.
function setState(newState) {
  app.state = newState;
  render();
}

render();
