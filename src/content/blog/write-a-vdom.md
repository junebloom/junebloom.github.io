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

### Equality!

First things first, our algorithm will need to be able to determine if two VDOM nodes are identical or not, so let's write a function for that.

```js
// Return true if `a` and `b` are "shallowly" equal, false if not.
function equals(a, b) {
  // If their tags are different, we know they're not identical elements.
  if (a[0] !== b[0]) return false;

  // Now we will iterate over the props of each element and compare them,
  // starting with a.
  for (const propName in a[1]) {
    // Return false if the property doesn't have an identical value on b.
    // This will catch any props that were changed or removed between a and b.
    if (a[1][propName] !== b[1][propName]) return false;
  }

  // Now iterate over b's props.
  for (const propName in b[1]) {
    // Return false if the property doesn't exist on a.
    // This catches any new properties of b that weren't present on a.
    if (a[1][propName] === undefined) return false;
  }

  // If we made it this far, they're equal!
  return true;
}
```

_(This function could possibly be optimized by tracking which property names we checked in the first for loop, and skipping the comparison in the second for loop if we've already checked that property, but simple comparison is already so fast that I'm not sure you'd actually see any real-world performance gain.)_

Perhaps you noticed that we don't do any checks for differences between the children of our elements. We skip this because it's not necessary. All of the children will be compared and dealt with by the diff algorithm. Sounds kind of sinister, actually.

You may have also noticed that we only compare props one layer deep. This is for simplicity and performance reasons. It has the consequence that if we have a mutable prop, mutations won't be detected by our algorithm. So let's deal with that by just defining that props must be treated as immutable. It's a feature.

### Creating Real DOM Nodes

We also need a function to create a real DOM element from a VDOM element:

```js
// Return a real DOM node for the given virtual node, recursively creating any
// children as well.
function createDomNode(virtualNode) {
  // We don't need to do anything special if virtualNode is a text node.
  if (typeof virtualNode === "string") return virtualNode;

  // If it's not a text node, then create a new DOM element with the right tag.
  const tag = virtualNode[0];
  const domNode = document.createElement(tag);

  // Iterate over the props of the virtual node and set them as attributes.
  const props = virtualNode[1];
  Object.entries(props).forEach(([key, value]) => {
    domNode[key] = value;
  });

  // Recursively create any children.
  const children = virtualNode[2];
  children.forEach((child) => {
    domNode.append(createDomNode(child));
  });

  // Return the constructed DOM node.
  return domNode;
}
```

This function just creates the element. Actually attaching it to the DOM will be done by the diffing algorithm, which we're ready to write now!

### Diffing

This will be the final function for our VDOM implementation. It's job will be to recursively determine the diff between two VDOM trees and update the real DOM accordingly. This function is somewhat difficult to reason about without context, so I guess I've got some explaining to do!

First, here is the function signature:

```js
function updateDom(a, b, domParent, index) {}
```

This is a recursive function, and it is important to recognize that, conceptually, we're only dealing with one node per iteration: The so-called "current node".

- `a` is the current node in its _previous state_, as a VDOM object.
- `b` is the current node in its _new state_, as a VDOM object. This is the "true" current node to which the real DOM should conform.
- And `domParent.childNodes[index]` is the real-DOM object which corresponds to the current node's previous state, and which we wish to update.

It is also important to note that, while these three things can be conceptualized as being the same imaginary "current node", `b` is likely to be "out of sync" with the other two and actually reference a completely different node. This can happen when nodes are added or removed, for example.

So it may be more helpful to think of `b` as the current node's true state, while `a` and the DOM node referenced by `index` refer to what _used_ to be where `b` currently is in the tree, regardless of whether that's the current node the same state, in an older state, or a completely different node.

In the case that `a` and `b` aren't identical, we don't do anything fancy, we just discard the DOM node and replace it with the current node's new state.

Hopefully this explanation makes it easier to follow! Let's get coding.

```js
// Recursively update the contents of DOM node `domParent` according to the
// diff between the previous VDOM node `a` and the new VDOM node `b`.
// `index` is the position of `a` as a real-DOM node in the
// `domParent.childNodes` array.
function updateDom(a, b, domParent, index) {
  // Store a reference to the DOM node we're currently dealing with.
  const domNode = domParent.childNodes[index];

  // If there is no previous state, then the current node is entirely new.
  if (!a) {
    // If this is a text node, we can just add it directly to the DOM.
    if (typeof b === "string") domParent.append(b);
    // Otherwise, we need to create a new DOM node and add that.
    else domParent.append(createDomNode(b));
  }

  // If there is no new-state, then the current node was removed.
  else if (!b) {
    // So we remove it from the DOM.
    domNode.remove();
  }

  // If the previous and new states are different, then the node changed.
  else if (!equals(a, b)) {
    // So we replace the old domNode with the updated current node.
    if (typeof b === "string") domNode.replaceWith(b);
    else domNode.replaceWith(createDomNode(b));
  }

  // If the current node wasn't removed, added, or changed, then we can recurse
  // over the current node's children to apply any potential updates to them.
  else {
    // Assign names to the children arrays, for readability.
    const childrenA = a[2];
    const childrenB = b[2];

    // Use the length of the longest array, to ensure we don't miss any nodes.
    const length = Math.max(childrenA.length, childrenB.length);

    // Iterate over and recursively update any children.
    for (let i = 0; i < length; i++) {
      updateDom(domNode, childrenA[i], childrenB[i], i);
    }
  }
}
```

Now we have everything we need for a functioning VDOM!

We could of course optimize our algorithm. For example, using string keys for lists of elements like React does would enable us to re-use perfectly good DOM nodes when sibling nodes are re-ordered, instead of throwing them out and completely re-building them just because they're in a different index position.

Another optimization React uses is that it updates attributes/properties atomically when possible, rather than re-rendering the entire DOM node every time a property changes.

I'll leave these optimizations as another exercise for you.

The only thing left now is to make our VDOM do something interesting.

## To-Do or Not To-Do

Let's do to-do. We'll keep it traditional.

Since we've only written a VDOM, we don't have any of the fancy fluff like state or update handling that a "real" front-end library or framework might provide, so we'll have to get our hands dirty and do some more DIY.

_(Don't expect anything too amazing. This is about implementing a VDOM, not a whole UI library.)_

```js
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
```

Now we can define the components for our app.

```js
// First, a todo item component.
// Clicking it marks it as complete.
const TodoItem = ({ todo, completeTodo }) => [
  "li",
  { onclick: () => completeTodo(todo) },
  [todo],
];

// Next, an input component for adding new todos.
const TodoInput = ({ input, setInput, addTodo }) => [
  "div",
  {},
  [
    [
      "input",
      { type: "text", value: input, oninput: (e) => setInput(e.target.value) },
      [],
    ],
    [
      "button",
      {
        onclick: () => {
          addTodo(input);
          setInput("");
        },
      },
      ["Add todo"],
    ],
  ],
];

// And most importantly, a todo app component to put it all together.
const TodoApp = (state, setState) => [
  "main",
  {},
  [
    ["h1", {}, ["Todos"]],
    TodoInput({
      input: state.input ?? "",
      setInput: (value) => setState({ ...state, input: value }),
      addTodo: (todo) => setState({ ...state, todos: [...state.todos, todo] }),
    }),
    [
      "ul",
      {},
      state.todos.map((todo) =>
        TodoItem({
          todo,
          completeTodo: () =>
            setState({
              ...state,
              todos: state.todos.filter((item) => item !== todo),
            }),
        })
      ),
    ],
  ],
];
```
