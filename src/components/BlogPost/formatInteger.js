const integerMap = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

export function formatInteger(n) {
  if (n < 10) return integerMap[n];
  else return n;
}
