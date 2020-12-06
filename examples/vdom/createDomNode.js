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
