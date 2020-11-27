// Return a map of properties that changed between `a` and `b`,
// or null if there were no changes.
export function diffProps(a, b) {
  let changed = false;
  const diff = {};

  // Iterate over the props of each element and compare them, starting with a.
  // This will catch any props that were changed or removed between a and b.
  for (const propName in a[1]) {
    if (a[1][propName] !== b[1][propName]) {
      diff[propName] = b[1][propName];
      changed = true;
    }
  }

  // Now iterate over b's props.
  // This catches any new props of b that weren't present on a.
  for (const propName in b[1]) {
    if (a[1][propName] === undefined) {
      diff[propName] = b[1][propName];
      changed = true;
    }
  }

  return changed ? diff : null;
}
