import { updateDom } from "../updateDom";
import { TodoApp } from "./TodoApp.js";

// Create an app object to hold all of our internals.
const app = {
  // This is the root DOM element to mount the VDOM to.
  root: document.getElementById("app"),

  // This is a function that returns the VDOM tree for our app.
  // (We'll define it below.)
  component: TodoApp,

  // For state, we'll just use an object.
  state: {},

  // Store our VDOM so we can diff it when we perform updates.
  vdom: [],

  // Render the app's VDOM and update the real DOM to match.
  render() {
    // Render the VDOM.
    const oldVdom = this.vdom;
    this.vdom = this.component(this.state, this.setState);

    // Update the real DOM.
    updateDom(oldVdom, this.vdom, this.root, 0);
  },

  // Update the state and trigger a render.
  setState(newState) {
    this.state = newState;
    this.render();
  },
};

app.render();
