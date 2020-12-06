import { createDomNode } from "./createDomNode.js";
import { diffProps } from "./diffProps.js";

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
