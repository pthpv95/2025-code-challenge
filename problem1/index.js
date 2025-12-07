var sum_to_n_a = function(n) {
  // Iterative approach using a for loop
  // Pros: Easy to understand, O(1) memory, no stack overflow risk
  // Cons: O(n) time complexity, slower than formula approach
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function(n) {
  // Mathematical formula: sum of 1 to n = n * (n + 1) / 2
  // Pros: O(1) time and space, fastest and most efficient
  // Cons: Less obvious to developers unfamiliar with the formula
  return (n * (n + 1)) / 2;
};

var sum_to_n_c = function(n) {
  // Recursive approach
  // Pros: Elegant and concise, mirrors mathematical definition
  // Cons: O(n) time and space, stack overflow risk for large n (>~10,000)
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_c(n - 1);
};

module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };