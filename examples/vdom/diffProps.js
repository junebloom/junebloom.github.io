// Shallowly compare the props of VDOM nodes `a` and `b`,
// returning a map of changes, or null if there were no changes.
function diffProps(a, b) {
  const propsA = a[1];
  const propsB = b[1];

  const diff = {};
  let changed = false;

  // Iterate over the props of each element and compare them, starting with a.
  for (const prop in propsA) {
    // This will catch any props that were updated or removed between a and b.
    if (propsA[prop] !== propsB[prop]) {
      diff[prop] = propsB[prop];
      changed = true;
    }
  }

  // Now iterate over b's props.
  for (const prop in propsB) {
    // This catches any new props of b that weren't present on a.
    if (propsA[prop] === undefined) {
      diff[prop] = propsB[prop];
      changed = true;
    }
  }

  return changed ? diff : null;
}
