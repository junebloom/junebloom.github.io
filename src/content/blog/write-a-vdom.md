---
title: Let's Code a Virtual DOM from Scratch
date: 2020-12-05
---

Perhaps you're aware that React uses a "virtual DOM" (VDOM), and have wondered _"What does that actually mean?"_. There are perfectly concise answers to this question, but they're just, kind of uh, less-than-satisfying. Today we're going to answer this question a bit more deeply by coding a virtual DOM from scratch, so buckle up!

There aren't a lot of situations where writing your own VDOM really makes sense, but it _is_ a pretty fun, and you will learn a lot about how React and similar libraries work. Oh and as a bonus, we'll use our virtual DOM to make a todo app at the end.

Let's get started!

## Refresher: What is the DOM?

_(Feel free to skip this section if you don't need the background.)_

DOM stands for _Document Object Model_. It is the standardized internal representation (_model_) that all browsers use for XML/HTML _documents_. Essentially, when a page loads, your browser parses the HTML source for the page and builds the DOM from it. An [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) or other [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) _object_ is created from every tag, comment, piece of text content, etc. in the source.

Take this HTML snippet for example:

```html
<p>Hello!</p>
```

The browser will parse this HTML into two DOM objects:

- An [HTMLParagraphElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLParagraphElement) to represent the `<p></p>` tag,
- and a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) Node to represent the `Hello!`.

Once the DOM is built, the browser uses it to actually render the page, but the most relevant part is that the browser exposes these DOM objects to us to manipulate via JavaScript. We can create, modify, and delete parts of the DOM from our JS code, an incredible power. But there's a problem.

### Declarative _vs_ Imperative

DOM manipulation with JS is _imperative_, whereas creating it with HTML is _declarative_. If you aren't familiar with these two styles of programming, the difference can be illustrated like so:

#### Declarative:

> I would like a peanut butter and banana sandwich, please!

#### Imperative:

> Get a plate. Get a knife. Get two slices of bread. Put the bread on the plate. Slice the banana into 16 pieces with the knife. Spread one ounce of peanut butter on each slice of bread. Place 8 banana slices on each slice of bread. Place the two slices of bread together. Give me the plate.

Basically, declarative code states the desired result and depends on some underlying code to be smart enough to figure out how to deliver it, whereas imperative code states a series of commands to follow to produce the desired result.

Take a look at a real example, where we accomplish the same thing using both paradigms:

```html
<!--
This HTML code is declarative. The browser knows how to interpret and deliver
the desired result.
-->
<div>
  <h1>Juniper</h1>
  <h2>Software Engineer</h2>
</div>
```

```js
// This JS code is imperative.
// We're giving explicit instructions for the browser to follow to produce
// the desired result.
const container = document.createElement("div");
const title = document.createElement("h1");
const subtitle = document.createElement("h2");

title.innerText = "Juniper";
subtitle.innerText = "Software Engineer";

container.appendChild(title);
container.appendChild(subtitle);
```

Imperative programming is very necessary and important, but in many cases, declarative programming can be a nicer developer experience. Defining DOM structures is one of these cases.

The role of a virtual DOM is to be the smart underlying code that knows how to deliver the results we desire. It allows us to create our page with all of the dynamic power of JavaScript, _declaratively_, and can even help us achieve optimal performance with our DOM updates. So how does it work?

## The Anatomy of a Virtual DOM

There are two main parts of a VDOM implementation.

- There is the **VDOM tree** itself, which is just a representation of the elements that make up the document tree,

- and there is a **diffing algorithm**, which takes the VDOM tree and turns it into actual DOM nodes for the browser to render.

Constructing a VDOM tree should be _fast_. The idea is that we can just re-compute the entire VDOM every time something on the page changes, and then our diffing algorithm will figure out an efficient way to update the actual DOM to match.

## The Virtual DOM Tree

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

Using these humble building blocks, we can declaratively model any document tree we desire:

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

_(If we wanted, we could write a simple function for the JSX compiler to compile to, allowing us to use JSX to create our VDOM structures, but I'll leave that as an exercise for you.)_

Now that we have defined what our VDOM structure should look like, we can write reusable functions to compose these structures:

```js
// A generic "page" component to wrap our content with a header and footer
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

// A home page
const HomePage = () =>
  Page([
    ["h1", {}, ["Welcome to my page!"]],
    ["p", {}, ["I hope you enjoy it here."]],
  ]);

// An about page
const AboutPage = () =>
  Page([
    ["h1", {}, ["About Me"]],
    ["p", {}, ["I like my DOMs virtual!"]],
  ]);
```

Starting to look familiar? Reminds you a little bit of React's functional components, doesn't it?

## The Diffing Algorithm

Tree structure defined, we just need an algorithm that can take our VDOM tree and update the actual DOM to reflect its content. This algorithm is of course the cold, imperative, robot heart of our virtual DOM. It makes our declarative code do something instead of nothing; a desirable feature.

Our algorithm will work by finding the difference (diff) between two VDOM trees. One tree represents the previous state of the document, and the other tree represents the new state of the document. The algorithm will use this diff to determine which DOM nodes to modify, and which ones to leave as they are.

### Starting Small

Before we tackle diffing an entire tree, it would be useful to get our diffing-feet wet with an easier subproblem.

We will need to know what properties of a single VDOM node have changed from one update to the next, so that we can atomically update just those properties if possible, rather than throwing out the whole real-DOM node and rebuilding it when a value changes.

Let's write a simple `diffProps` function to identify those changes.

```js
// Shallowly compare the props of VDOM nodes `a` and `b`,
// returning a map of changes, or null if there were no changes.
export function diffProps(a, b) {
  const oldProps = a[1];
  const newProps = b[1];

  const diff = {};
  let changed = false;

  // Iterate over the props of each element and compare them, starting with a.
  for (const prop in oldProps) {
    // This will catch any props that were updated or removed between a and b.
    if (oldProps[prop] !== newProps[prop]) {
      diff[prop] = newProps[prop];
      changed = true;
    }
  }

  // Now iterate over b's props.
  for (const prop in newProps) {
    // This catches any new props of b that weren't present on a.
    if (oldProps[prop] === undefined) {
      diff[prop] = newProps[prop];
      changed = true;
    }
  }

  return changed ? diff : null;
}
```

_(This function could possibly be optimized by tracking which property names we checked in the first for loop, and skipping the comparison in the second for loop if we've already checked that property, but simple comparison is generally pretty fast so I'm not sure how much performance gain you'd see. Feel free to test it out!)_

You may have noticed that we only compare props one layer deep. This is for simplicity and performance reasons. It has the consequence that if we have a mutable prop, mutations won't be detected by our algorithm. So let's deal with that by saying that props must be treated as immutable. It's a feature!

### Creating Real DOM Nodes

We need a function that can turn a VDOM node into something we can attach to the real DOM. This one's easy.

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

This will be the final function for our VDOM implementation. It's job will be to recursively determine the diff between two VDOM trees and update the real DOM accordingly. Unlike `diffProps()`, this function will directly perform DOM modifications while it does the diff, rather than returning a diff object.

The algorithm is pretty simple, but it can still be somewhat difficult to reason about, so I've done my best to make the code super digestible. I'll also give you a little background before we get to the code.

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

Let's code!

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

Now we have everything we need for a functioning virtual DOM! Conceptually, this is almost the same approach that React uses for diffing, and it works really well.

We could always add features or optimize it, of course. For example, currently, if we remove a node from a set of siblings, then all of the sibling DOM nodes after it in the list will be modified unnecessarily, due to their positions shifting by one. React handles this by optionally using unique string keys for lists of elements rather than keeping track of them by numeric index relative to their siblings. This allows React to track list items across renders and only update their DOM objects if they actually change.

I'll leave that as an exercise for you, though.

The only thing left now is to put our little VDOM to the test.

## Bonus: Todo or Not Todo

Let's make a traditional todo example app, familiar to frontend engineers. Since we've only written a VDOM, we don't have any of the fancy fluff like state or update handling that a "real" frontend library or framework might provide, so we'll have to get our hands dirty and do some more DIY.

_(Don't expect anything too amazing! This article is about implementing a VDOM, not a whole UI library.)_

We need to define the components for our app. For brevity, I'm omitting any styles, but a simple `classname` or `style` property is all it takes to unlock the full power of CSS styling in our little VDOM.

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

Now we need to whip up some "improvised frontend library" glue to bring our VDOM to life.

```js
// Set up the app internals for mounting to the DOM and handling updates.
const app = {
  // This is the DOM element to mount the VDOM to.
  root: document.getElementById("app"),

  // This is a functional component that returns the VDOM tree for our app.
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

And in just a few easy steps, we have a fully functional todo app built with our very own virtual DOM. Check it out! Click a todo item to complete it. Add your own todos. Everything works.

<iframe height="340" style="width: 100%;" scrolling="no" title="VDOM from Scratch: Todo" src="https://codepen.io/junebloom/embed/OJRPLeY?height=340&theme-id=dark&default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/junebloom/pen/OJRPLeY'>VDOM from Scratch: Todo</a> by Juniper
  (<a href='https://codepen.io/junebloom'>@junebloom</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Conclusion

By this point we have explored why a virtual DOM can be useful, how to design the actual structure of a VDOM, how to reconcile that structure with the real DOM, and how these things relate to React.

As engineers, understanding how our tools work is important. If we have deep knowledge of our tools, then we can use them in creative ways, we can avoid misusing them, we can hack them, we can build new ones, and we can simply better appreciate the hard work that goes in to making the things we may take for granted.

I hope you learned something new or at least had fun!

_(You can find all of the code from this article [here](https://github.com/junebloom/junebloom.github.io/tree/main/examples/vdom).)_
