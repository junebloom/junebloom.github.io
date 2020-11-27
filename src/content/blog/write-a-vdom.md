---
title: Let's Code a Virtual DOM
date: 2020-11-22
---

I'm sure you've heard the term _virtual DOM_ (VDOM) before. You probably even know that libraries like React are designed around the concept, but maybe you don't know exactly what a VDOM is or how it works, and if so, you've come to the right place! We're going to explore the concept of "the VDOM" by actually coding one from scratch, so buckle up!

For the average frontend engineer or web developer there aren't a lot of situations where writing your own VDOM makes sense, but it _is_ a really great learning experience that will help you understand what makes React work. Let's get started.

_(If you want to get straight to coding, just skip to the section The Anatomy of a VDOM.)_

## _What is the DOM, anyway?_

First, DOM stands for _Document Object Model_. It is the internal representation that all browsers use for HTML documents. Essentially, when a page loads, your browser parses the HTML source for the page and builds the DOM from it. An [Element]() or [Node]() object is created from every tag and piece of text content in the source.

Take this HTML snippet for example:

```html
<p>Hello!</p>
```

The browser will parse this HTML into two DOM objects:

- An Element to represent the `<p></p>` tag,
- and a text Node to represent the `Hello!`.

### DOM Manipulation

Once the DOM is built, the browser uses it to actually render the page, but the most relevant part is that the browser exposes these DOM objects to us to manipulate via JavaScript. We can create, modify, and delete parts of the DOM from our JS code, an incredible power. JQuery is a library that dominated the web for a long time, and it was (mis)used to directly manipulate the DOM in all sorts of (terrifying) ways.

The thing about manipulating the DOM is that it's just kind of slow, and if you aren't careful, you can cause huge portions of the page to be re-rendered unnecessarily, making your page painfully janky, and all around unpleasant to use.

### Imperative _vs_ Declarative

The other problem is that manipulating the DOM with JavaScript is done _imperatively_, whereas creating it with HTML is done _declaratively_. If you aren't familiar with these two styles of programming, the difference can be illustrated like this:

- Declarative: _"I would like a peanut butter and banana sandwich please."_

- Imperative: _"Get a plate. Get a knife. Get two slices of bread. Put the bread on the plate. Slice the banana into 16 pieces with the knife. Spread one ounce of peanut butter on each slice of bread. Place 8 banana slices on each slice of bread. Place the two slices of bread together. Give me the plate."_

Basically, declarative code states the desired result and depends on some underlying code to be smart enough to figure out how to deliver it, whereas imperative code states a series of commands to follow to produce the desired result. Take a look at a real example:

```html
<!-- This HTML code is declarative.
The browser "just knows" how to deliver the desired result. -->
<div>
  <h1>Juniper</h1>
  <h2>Software Engineer</h2>
</div>
```

```js
// This JS code is imperative.
// We're giving explicit instructions for the browser to follow.
const container = document.createElement("div");
const title = document.createElement("h1");
const subtitle = document.createElement("h2");

title.innerText = "Juniper";
subtitle.innerText = "Software Engineer";

container.appendChild(title);
container.appendChild(subtitle);
```

In general, declarative programming is a nicer developer experience. Now, remember how I said _"declarative code states the desired result and depends on some underlying code to be smart enough to figure out how to deliver it"_?

A virtual DOM is that smart underlying code. It allows us to create our page with all of the power of JavaScript, _declaratively_, and even helps us achieve optimal performance with our DOM updates. So how does it work?

## The Anatomy of a VDOM

There are two main parts of a VDOM implementation.

- There is the **VDOM tree** itself, which is just a representation (a _model_) of the elements that make up the document tree,

- and there is an **algorithm**, which takes the VDOM tree and turns it into actual DOM nodes for the browser to render.

Constructing a VDOM tree should be _fast_. The idea is that we can just re-compute the entire VDOM every time something on the page changes, and then our algorithm will figure out an efficient way to update the actual DOM to match.

### The VDOM Tree

Okay, let's start coding! We need to be able to represent HTML elements in a way that is fast to recompute. For this, let's define a very simple structure:

```js
// A text node.
// This is just some text that can be displayed on the page.
const text = "Hello, VDOM!";

// A single VDOM element.
// This is an array where the first item is the tag name,
// the second item is a dictionary of attributes (props),
// and the third item is an array of child elements/text nodes.
const element = ["a", { href: "https://..." }, [text]];
```

With this humble structure, we can declaratively model any document tree we desire:

```js
const page = [
  "div",
  {},
  [
    ["header", {}, [["a", { href: "/" }, ["Home"]]]],
    [
      "main",
      {},
      [
        ["h1", {}, ["Welcome to my page!"]],
        ["p", {}, ["I hope you enjoy it here."]],
      ],
    ],
    ["footer", {}, ["Made with <3"]],
  ],
];
```

This kind of representation is very similar to what React uses, except React uses objects instead of arrays, and provides a `createElement` function to generate those objects, and most people use JSX, which hides the `createElement` calls behind a compile step, allowing you to write VDOM structures using XML-like syntax similar to HTML. But other than that, just like React!

We could even write a simple function for the JSX compiler to compile to, allowing us to use JSX with our VDOM, but I'll leave that as an exercise for you.

Now that we have a defined VDOM structure, we can write reusable functions to compose these structures:

```js
// A generic page component to wrap our content with a header and footer
const Page = (children) => [
  "div",
  {},
  [
    [
      "header",
      {},
      [
        ["a", { href: "/" }, ["Home"]],
        ["a", { href: "/about" }, ["About"]],
      ],
    ],
    ["main", {}, children],
    ["footer", {}, ["Made with <3"]],
  ],
];

// Home page component
const HomePage = () =>
  Page([
    ["h1", {}, ["Welcome to my page!"]],
    ["p", {}, ["I hope you enjoy it here."]],
  ]);

// About page component
const AboutPage = () =>
  Page([
    ["h1", {}, ["About Me"]],
    ["p", {}, ["I like my DOMs virtual!"]],
  ]);
```

Starting to look familiar? Kind of reminds you of React's functional components, doesn't it?

## The VDOM Algorithm

Now we just need an algorithm that can take our VDOM tree and update the actual DOM to reflect its content. This algorithm is of course the cold, imperative, robot heart of our virtual DOM. It makes our declarative code do something instead of nothing; a desirable feature.

Our algorithm will work by finding the difference (diff) between two VDOM trees. One tree represents the previous state of the document, and the other tree represents the new state of the document. The algorithm will then use this diff to determine which DOM nodes to modify, and which ones to leave as they are.

### Starting Small

Before we tackle diffing an entire tree, it would be useful to get our diffing-feet wet with an easier subproblem. We will need to know what properties of a single VDOM node have changed from one update to the next, so that we can atomically update just those properties if possible, rather than throwing out the whole real-DOM node and rebuilding it when a value changes.

Let's write a simple `diffProps` function to identify those changes.

```js
// Shallowly compare the props of VDOM nodes `a` and `b`,
// returning a map of changes, or null if there were no changes.
function diffProps(a, b) {
  const propsA = a[1];
  const propsB = b[1];

  const diff = {};
  let changed = false;

  // Iterate over the props of each element and compare them, starting with a.
  for (const prop in propsA) {
    // This will catch any props that were updated or removed between a and b.
    if (propsA[prop] !== propsB[prop]) {
      diff[prop] = propsB[prop];
      changed = true;
    }
  }

  // Now iterate over b's props.
  for (const prop in propsB) {
    // This catches any new props of b that weren't present on a.
    if (propsA[prop] === undefined) {
      diff[prop] = propsB[prop];
      changed = true;
    }
  }

  return changed ? diff : null;
}
```

_(This function could possibly be optimized by tracking which property names we checked in the first for loop, and skipping the comparison in the second for loop if we've already checked that property, but simple comparison is generally pretty fast so I'm not sure how much performance gain you'd see. Feel free to test it out!)_

You may have noticed that we only compare props one layer deep. This is for simplicity and performance reasons. It has the consequence that if we have a mutable prop, mutations won't be detected by our algorithm. So let's deal with that by saying that props must be treated as immutable. It's a feature!

### Creating Real DOM Nodes

We need a function that can turn a VDOM node into something we can attach to the real DOM. Easy enough.

```js
// Create and return a real DOM node for the given VDOM node, recursively
// creating any children as well.
export function createDomNode(node) {
  // Strings (text nodes) can be added directly to the DOM,
  // so we don't need to do anything.
  if (typeof node === "string") return node;

  // Create a new DOM element.
  const tag = node[0];
  const domNode = document.createElement(tag);

  // Iterate over the props of the virtual node and set them as attributes.
  const props = node[1];
  for (const prop in props) {
    domNode[prop] = props[prop];
  }

  // Create the node's children.
  const children = node[2];
  children.forEach((child) => {
    domNode.append(createDomNode(child));
  });

  // Return the constructed DOM node.
  return domNode;
}
```

This function just creates the DOM node. Actually attaching it to the DOM will be done by the diffing algorithm, which we're ready to approach now!

### Dealing with Diffing

This will be the final function for our VDOM implementation. It's job will be to recursively determine the diff between two VDOM trees and update the real DOM accordingly. Unlike `diffProps()`, this function will perform DOM modifications as it does the diff, rather than returning a diff object.

The algorithm is pretty simple, but it can still be somewhat difficult to reason about, so I've done my best to make the code super digestible. I'll also give you some quick background right now before we get to the code.

First, here is the function signature:

```js
function updateDom(a, b, domParent, index) {}
```

This is a recursive function, and it is important to recognize that, conceptually, we're really only dealing with one node per iteration: The so-called "current node".

- `a` is the current node in its _previous state_, as a VDOM object.
- `b` is the current node in its _new state_, as a VDOM object. This is the "true" current node to which the real DOM should conform.
- And `domParent.childNodes[index]` is the real-DOM object which corresponds to the current node's previous state, and which we wish to update to match `b`.

It is also important to note that as nodes are added and removed, `b` is likely to be "out of sync" with `a` and `index`, possibly referencing a completely different node.

I find it most helpful to remember that `b` is the current node's true state, while `a` and the DOM node referenced by `index` refer to what _used_ to be where `b` currently is in the tree, regardless of whether that's the current node the same state, in an older state, or a completely different node. The job of the algorithm is to modify the DOM to match `b`, no matter how out of sync they may have gotten.

I think we're ready to code this diff.

```js
// Recursively update the contents of DOM node `domParent` according to the
// diff between the previous VDOM node `a` and the new VDOM node `b`.
// `index` is the position of `a` as a real-DOM node in the
// `domParent.childNodes` array.
export function updateDom(a, b, domParent, index) {
  const isTextNode = typeof b === "string"; // Is this a text node?
  let typeChanged = false; // Did its type change? (div, p, li, etc.)
  let updatedProps = null; // Which if any props changed?

  // typeChanged and updatedProps are only needed for non-text nodes that
  // previously existed and still exist.
  if (!isTextNode && a && b) {
    typeChanged = a[0] !== b[0];
    if (!typeChanged) updatedProps = diffProps(a, b);
  }

  // Determine if and how this node was modified.
  let modification = null;

  // If there is no previous-state, then the current node is newly added.
  if (!a) modification = "added";
  // If there is no new-state, then the node was removed.
  else if (!b) modification = "removed";
  // If the node is an element and its type changed (div, p, li, etc.), or
  // if it is a text node and its text changed, then the node was replaced.
  else if (typeChanged || (isTextNode && a !== b)) modification = "replaced";
  // If the node's type is the same but its properties changed,
  // then the node was updated.
  else if (!typeChanged && updatedProps) modification = "updated";

  // Store a reference to the possibly existing DOM node, in case we need it.
  const domNode = domParent.childNodes[index];

  // Update the DOM.
  switch (modification) {
    case "added":
      // Add the node to the DOM. (There is no existing DOM node.)
      domParent.append(createDomNode(b));
      break;

    case "removed":
      // Remove the node from the DOM.
      domNode.remove();
      break;

    case "replaced":
      // Replace the existing DOM node with a new one.
      domNode.replaceWith(createDomNode(b));
      break;

    case "updated":
      // Update the node's props in-place, without re-creating the DOM node.
      for (const prop in updatedProps) {
        domNode[prop] = updatedProps[prop];
      }
      break;
  }

  // Recurse.
  // If the node wasn't added, removed, or replaced, then we need to recurse
  // and update any children it may have.
  // (If it was added or replaced, then updated children were already created
  // by createDomNode, and removed nodes obviously don't need fresh children.)
  if (modification === null || modification === "updated") {
    const oldChildren = a[2] ?? [];
    const newChildren = b[2] ?? [];

    for (let i = 0; i < Math.max(oldChildren.length, newChildren.length); i++) {
      updateDom(oldChildren[i], newChildren[i], domNode, i);
    }
  }
}
```

Now we have everything we need for a functioning VDOM! Conceptually, this is almost the same approach that React uses for diffing, and it works really well.

We could always add features or optimize it, of course. For example, currently, if we remove a node from a set of siblings, then all of the sibling DOM nodes after it in the list will be modified unnecessarily, due to their positions shifting by one. React handles this by using unique string keys for lists of elements rather than keeping track of them by numeric index relative to their siblings. This allows React to track list items across renders and only update their DOM objects if they actually change.

I'll leave that as an exercise for you, though.

The only thing left now is to put our little VDOM to the test.

## To-Do or Not To-Do

Let's do to-do. We'll keep it traditional.

Since we've only written a VDOM, we don't have any of the fancy fluff like state or update handling that a "real" front-end library or framework might provide, so we'll have to get our hands dirty and do some more DIY.

_(Don't expect anything too amazing! This article is about implementing a VDOM, not a whole UI library.)_

```js
// Set up the app internals for mounting to the DOM and handling updates.
const app = {
  // This is the DOM element to mount the VDOM to.
  root: document.getElementById("app"),

  // This is a functional component that returns the VDOM tree for our app.
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

// Renders the app's VDOM and updates the real DOM to match.
function render() {
  // Compute the VDOM.
  const old = app.vdom;
  app.vdom = app.component(getState, setState);

  // Update the real DOM.
  updateDom(old, app.vdom, app.root, 0);
}

// Updates the state and triggers a render.
function setState(callback) {
  app.state = callback(app.state);
  render();
}

// Perform the initial render.
render();
```

Next we need to define the components for our app:

```js
// First, a todo item component.
// Clicking it marks it as complete.
const TodoItem = ({ todo, completeTodo }) => [
  "li",
  { onclick: () => completeTodo(todo) },
  [todo],
];
```

```js
// Next, an input component for adding new todos.
const TodoInput = ({ input, setInput, addTodo }) => {
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
```

```js
// And most importantly, a todo app component to put it all together.
const TodoApp = (state, setState) => {
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
```
