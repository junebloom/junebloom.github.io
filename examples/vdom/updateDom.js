import { createDomNode } from "./createDomNode.js";
import { diffProps } from "./diffProps.js";

// Recursively update the contents of DOM node `domParent` according to the
// diff between the previous VDOM node `a` and the new VDOM node `b`.
// `index` is the position of `a` as a real-DOM node in the
// `domParent.childNodes` array.
export function updateDom(a, b, domParent, index) {
  // Store a reference to the DOM node we're currently dealing with.
  const domNode = domParent.childNodes[index];

  // We need to know if b is a text node so we can update the DOM correctly.
  const isTextNode = typeof b === "string";

  // We also need to know if the type of the node (div, p, li, etc.) changed.
  let typeChanged = false;
  if (!isTextNode && a && b) typeChanged = a[0] !== b[0];

  // And we need to know which, if any, properties changed between a and b.
  let updatedProps = null;
  if (!isTextNode && !typeChanged && a && b) updatedProps = diffProps(a, b);

  //
  // Let's categorize any VDOM changes made. Note that these categories are
  // mutually exclusive. Only one will be true.
  //

  // If there is no previous-state, then the current node is newly added.
  const added = !a;

  // If there is no new-state, then the node was removed.
  const removed = !b;

  // If the node is an element and its type changed (div, p, li, etc.),
  // or if it is a text node and its text changed, then the node was replaced.
  const replaced = typeChanged || (isTextNode && a !== b);

  // If the node's type is the same but its properties changed,
  // then the node was updated.
  const updated = !typeChanged && updatedProps;

  //
  // We are now ready to modify the DOM according to these changes.
  //

  // Add the node to the DOM.
  if (added) {
    // If this is a text node, we can just add it directly to the DOM.
    if (isTextNode) domParent.append(b);
    // Otherwise, we need to create a new DOM node and add that.
    else domParent.append(createDomNode(b));
  }

  // Remove the node from the DOM.
  else if (removed) {
    domNode.remove();
  }

  // Replace the existing DOM node with a new one.
  else if (replaced) {
    if (isTextNode) domNode.replaceWith(b);
    else domNode.replaceWith(createDomNode(b));
  }

  // Update the node's properties in-place, without re-creating the DOM node.
  else if (updated) {
    for (const prop in updatedProps) {
      domNode[prop] = updatedProps[prop];
    }
  }

  // If the node wasn't added, removed, or replaced, then we need to recurse
  // over the node's children to diff and update them.
  // (If it _was_ added or replaced, then updated children were already created
  // by createDomNode. And removed nodes obviously don't need fresh children.)
  if (!added && !removed && !replaced) {
    // Assign names to the children arrays, for readability.
    const oldChildren = a[2] ?? [];
    const newChildren = b[2] ?? [];

    // Use the length of the longest array, to ensure we don't skip any children.
    const length = Math.max(oldChildren.length, newChildren.length);

    // Iterate over and recursively update any children.
    for (let i = 0; i < length; i++) {
      updateDom(oldChildren[i], newChildren[i], domNode, i);
    }
  }
}
