---
title: Let's Code a Virtual DOM
date: 2020-11-22
---

I'm sure you've heard the term _virtual DOM_ (VDOM) before. You probably even know that libraries like React are designed around the concept, but maybe you don't know exactly what a VDOM is or how it works, and if so, you've come to the right place! We're going to explore the concept of "the VDOM" by actually coding one from scratch, so buckle up!

For the average frontend engineer or web developer there aren't a lot of practical situations where writing your own VDOM makes sense, but it _is_ a really great learning experience that will help you understand what makes React work. Let's get started.

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

Constructing a VDOM tree should be _fast_. The idea is that we can just re-compute the entire VDOM every time something on the page changes, and then the algorithm we write will figure out the minimal number of steps required to update the actual DOM to match.

### The VDOM Tree

Okay, let's start coding! We need to be able to represent HTML elements in a way that is fast to recompute. For this, let's define a very simple structure:

```js
// A text node.
// This is just some text that can be displayed on the page.
const text = "Hello, VDOM!";

// A single VDOM element.
// This is an array where the first item is the tag name,
// the second item is a dictionary of attributes,
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

This kind of representation is very similar to what React uses, except React uses objects instead of arrays, and provides a `createElement` function to generate those objects, and most people use JSX, which hides the createElement calls behind a compile step, allowing you to write these VDOM structures using XML-like syntax similar to HTML. But other than that, just like React!

Now that we have a defined VDOM structure, we can also define a way to write reusable functions to compose these structures:

```js
// A generic page component we can use to make pages with a consistent
// header and footer
const Page = (props) => [
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
    ["main", {}, props.children],
    ["footer", {}, ["Made with <3"]],
  ],
];

const HomePage = () => [
  Page,
  {},
  [
    ["h1", {}, ["Welcome to my page!"]],
    ["p", {}, ["I hope you enjoy it here."]],
  ],
];

const AboutPage = () => [
  Page,
  {},
  [
    ["h1", {}, ["About Me"]],
    ["p", {}, ["I love web stuff!"]],
  ],
];
```

Starting to look familiar? Kind of reminds you of React's functional components, doesn't it?

## The VDOM Algorithm

Now we just need an algorithm that can take our VDOM trees and update the actual DOM to reflect their content. Should be simple, right?

This algorithm is of course the cold, imperative robot heart of our virtual DOM. It makes our declarative code do something instead of nothing; a desirable feature.

To begin,
