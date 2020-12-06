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
