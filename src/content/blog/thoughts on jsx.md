---
title: Can You Really Use React Without JSX?
date: 2020-10-30
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

Instead of forcing my components to fit into JSX, I tried dropping JSX entirely. This also let me stay closer to the original no-build-step spirit of the project. And it turns out that I had almost no problems foregoing JSX. For application UI, it felt totally natural to write and consume components using plain JS.

_**But** this doesn't mean that this will always be the case, or that JSX is bad._ In fact, I think JSX is a very good solution for its problem domain, and virtually every React application benefits from it. In practice, the quirks mentioned above are only problematic in narrow circumstances, and using plain `createElement` calls can only scale so far before becoming unwieldy.

For example, a good use-case for JSX is in the [Footer component](https://github.com/junebloom/practical/blob/develop/src/components/Footer.js) of my app. It is an area that makes use of nested hypertext elements, and I had to simplify its layout to keep the code readable. Writing such components using some kind of domain-specific HyperTextMarkupLanguage-based syntax would be great!

I was able to design components for the app in such a way that I didn't have any major problems with `createElement`, but that's not always possible. Compare plain JS to the JSX for a component from the site you're currently on:

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

Which one would you rather maintain?

Personally, I find the JSX significantly easier to read. Props, children, and siblings are all separated very clearly, so it takes no effort to distinguish them at a glance. The same isn't true of the `createElement` calls.

There is of course middle ground here. You could write an abstraction or use a library that wraps `createElement` in some way to make it easier to use. But no matter how clever the abstraction, ECMAScript syntax is designed to be general-purpose. It can certainly do the job, but at some point it makes sense to have a purpose-made domain-specific syntax for writing markup.

---

While writing this, I started to wonder about something else as well. What does JSX actually _mean_?

[React's docs](https://reactjs.org/docs/introducing-jsx.html#why-jsx) give some basic justifications for JSX, and the [JSX specification](https://facebook.github.io/jsx/) gives some slightly more nuanced justifications, particularly regarding the alternative of template literals, but neither explains the rationale for the name itself.

Is it JSX*(tension)*? JSX*(ML)*? Something else? The spec states:

> JSX is an XML-like syntax extension to ECMAScript without any defined semantics.

Maybe it is the case that, like the extension itself, the name has no defined semantics.

It's just JSX.
