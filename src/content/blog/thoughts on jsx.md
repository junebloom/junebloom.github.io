---
title: Some Thoughts on Dropping JSX
date: 2020-11-02
---

Recently I was working on [an application](https://github.com/junebloom/practical) which started out both as an experiment in writing a zero-dependency and no-build-step web app, and as an actual tool I needed for myself.

When I started, I had a very small custom VDOM, and the components I wrote for it were in plain JS. But after running in to limitations with my VDOM, I chose to switch to React for the sake of completing the project, rather than reinvent the wheel. _(I'll totally give reinventing the wheel another shot, though!)_

So I swapped in React and started translating my components to JSX, but after doing so I thought they seemed less readable than before. How could this be? Well I wrote the components without JSX in mind, so a direct translation was likely to run into some weird spots. Compare passing props in JS and JSX for example:

```js
import { createElement as h } from "react";
// ...

// In plain JS we just pass an object:
h(RecordingsList, { recordings, player });
```

```jsx
// In JSX we have to either repeat the property names...
<RecordingsList recordings={recordings} player={player} />
```

```jsx
// ...or use object spreading in an odd way:
<RecordingsList {...{ recordings, player }} />
```

_(What is our object spreading in to, exactly? An implied object literal that will only be present after transpiling, it seems. It feels icky to write an invalid JS expression and then rely on the transpiler to complete it. It also seems silly to create an object literal whose sole purpose is to be spread.)_

Instead of forcing my components to fit into JSX, I tried dropping JSX entirely. This also let me stay closer to the original no-build-step spirit of the project. And it turns out that I had almost no problems foregoing JSX. For application UI, it felt pretty natural to write and consume components using plain JS.

_But this doesn't mean that this will always be the case, or that JSX is bad._ In fact, I think JSX is a very good solution for its problem domain, and virtually every React application benefits from it. In practice, the quirks mentioned above are only problematic in narrow circumstances, and using plain `createElement` calls can only scale so far before becoming unwieldy.

For example, a good use-case for JSX is in the [Footer component](https://github.com/junebloom/practical/blob/develop/src/components/Footer.js) of my app. It is an area that makes use of nested hypertext elements, and I had to simplify its layout to keep the code readable. Writing such components using some kind of domain-specific HyperTextMarkupLanguage-based syntax would be great!

I noticed that with `createElement`, components can quickly become difficult enough to read that it starts to take significant effort to "visually optimize" the structure of the markup to keep it simple enough to understand. This can be seen as a negative or a positive, as it can impact productivity, but with the possible benefit of encouraging more thoughtful markup.

Compare plain JS to the JSX for a component from the site you're currently on:

```js
h(
  "li",
  null,
  h(
    "a",
    {
      href,
      className:
        "flex items-center md:grid grid-rows-3 gap-4 md:gap-0 p-4 md:h-56 hover:no-underline bg-indigo-100 text-indigo-600 hover:bg-red-400 hover:text-white group",
    },
    h("div", { className: "row-start-2 md:mx-auto text-2xl" }, h(Icon)),
    h(
      "div",
      {
        className:
          "row-start-3 flex-grow flex md:flex-col justify-between md:text-center leading-5",
      },
      h("span", { className: "text-lg" }, title),
      h(
        "span",
        { className: "font-semibold text-indigo-400 group-hover:text-white" },
        subtitle
      )
    )
  )
);
```

```jsx
<li>
  <a
    href={href}
    className="flex items-center md:grid grid-rows-3 gap-4 md:gap-0 p-4 md:h-56 hover:no-underline bg-indigo-100 text-indigo-600 hover:bg-red-400 hover:text-white group"
  >
    <div className="row-start-2 md:mx-auto text-2xl">
      <Icon />
    </div>
    <div className="row-start-3 flex-grow flex md:flex-col justify-between md:text-center leading-5">
      <span className="text-lg">{title}</span>
      <span className="font-semibold text-indigo-400 group-hover:text-white">
        {subtitle}
      </span>
    </div>
  </a>
</li>
```

The differences aren't huge, but which one would you rather maintain?

Personally, I find the JSX easier to read. Props, children, and siblings are all separated very clearly, so it takes no effort to distinguish them at a glance. The same isn't true of the `createElement` calls.

There is middle ground, of course. You could write an abstraction or use a library that wraps `createElement` to make it nicer to use, but ECMAScript syntax is still designed to be general-purpose. Maybe there's a point at which a domain-specific syntax for writing markup just makes things easier.

But that won't stop my search for better solutions. I _want_ authoring components in pure ECMAScript to be the best experience possible. I _don't want_ a build step, or a bloated, fragile layer of nonstandard tools with a million dependencies between my code and the user.

Luckily, there are plenty of interesting ideas to be explored. The seed of the concept that will make JSX obsolete has probably already been planted. It will be enticing in its expressiveness and subtle in its simplicity.

And with the pace of progress on the web, the day when we can publish production-ready projects using nothing but our favorite text editor and browser doesn't feel so distant.

---

While writing this, I started to wonder about something else as well. What does JSX actually _mean_?

[React's docs](https://reactjs.org/docs/introducing-jsx.html#why-jsx) give some basic justifications for JSX, and the [JSX specification](https://facebook.github.io/jsx/) gives some slightly more nuanced justifications, particularly regarding the alternative of template literals, but neither explains the rationale for the name itself.

Is it **J**avascript **S**yntax e**X**tension? **J**ava**S**cript e**X**tension? **J**ava**S**cript **X**ML? Something else?

The spec states:

> JSX is an XML-like syntax extension to ECMAScript without any defined semantics.

Maybe it is the case that, like the extension itself, the name has no defined semantics. It's just JSX.
