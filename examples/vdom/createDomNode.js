// Return a real DOM node for the given virtual node, recursively creating any
// children as well.
export function createDomNode(virtualNode) {
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
