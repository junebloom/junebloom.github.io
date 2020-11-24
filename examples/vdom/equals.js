// Return true if `a` and `b` are "shallowly" equal, false if not.
export function equals(a, b) {
  // If their tags are different, we know they're not identical elements.
  if (a[0] !== b[0]) return false;

  // Now we will iterate over the props of each element and compare them,
  // starting with a.
  for (const propName in a[1]) {
    // Return false if the property doesn't have an identical value on b.
    // This will catch any props that were changed or removed between a and b.
    if (a[1][propName] !== b[1][propName]) return false;
  }

  // Now iterate over b's props.
  for (const propName in b[1]) {
    // Return false if the property doesn't exist on a.
    // This catches any new properties of b that weren't present on a.
    if (a[1][propName] === undefined) return false;
  }

  // If we made it this far, they're equal!
  return true;
}
