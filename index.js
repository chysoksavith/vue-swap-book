function evaluateExpression(expression) {
  // Remove spaces and tokenize
  const tokens = expression
    .replace(/\s/g, "")
    .split(/([+\-*/()])/)
    .filter((t) => t);

  // Helper function to evaluate tokens recursively
  function evaluate(tokens, start = 0) {
    let stack = [];
    let operator = "+";
    let i = start;

    while (i < tokens.length) {
      const token = tokens[i];

      if (token === "(") {
        // Recursively evaluate inside parentheses
        const [result, newIndex] = evaluate(tokens, i + 1);
        i = newIndex;
        stack.push(result);
      } else if (token === ")") {
        // Return result and new index when closing parenthesis
        return [computeStack(stack), i];
      } else if (["+", "-", "*", "/"].includes(token)) {
        operator = token;
      } else {
        // Number: Apply the previous operator
        const num = parseFloat(token);
        if (operator === "+") stack.push(num);
        else if (operator === "-") stack.push(-num);
        else if (operator === "*") stack.push(stack.pop() * num);
        else if (operator === "/") stack.push(stack.pop() / num);
      }
      i++;
    }
    return [computeStack(stack), i];
  }

  // Compute the final result from the stack, respecting precedence
  function computeStack(stack) {
    // First pass: Handle * and /
    let temp = [];
    for (let i = 0; i < stack.length; i++) {
      if (i > 0 && (stack[i - 1] === "*" || stack[i - 1] === "/")) continue;
      if (i > 0 && stack[i - 1] === "*") temp.push(temp.pop() * stack[i]);
      else if (i > 0 && stack[i - 1] === "/") temp.push(temp.pop() / stack[i]);
      else temp.push(stack[i]);
    }
    // Second pass: Handle + and -
    return temp.reduce((acc, val) => acc + val, 0);
  }

  const [result] = evaluate(tokens);
  return result;
}

// Test cases
console.log(evaluateExpression("(1 + 2) * 10 - 6 / (9 * (2 + 1))")); // Expected: 28 / 27 ≈ 1.037
console.log(evaluateExpression("1 + 2 * 3")); // Expected: 7
console.log(evaluateExpression("(2 + 3) * 4")); // Expected: 20
