import { createDomNode } from "./createDomNode.js";
import { equals } from "./equals.js";

// Recursively update the contents of DOM node `domParent` according to the
// diff between the previous VDOM node `a` and the new VDOM node `b`.
// `index` is the position of `a` as a real-DOM node in the
// `domParent.childNodes` array.
export function updateDom(a, b, domParent, index) {
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
    const childrenA = a[2] ?? [];
    const childrenB = b[2] ?? [];

    // Use the length of the longest array, to ensure we don't miss any nodes.
    const length = Math.max(childrenA.length, childrenB.length);

    // Iterate over and recursively update any children.
    for (let i = 0; i < length; i++) {
      updateDom(childrenA[i], childrenB[i], domNode, i);
    }
  }
}
