import { NumberToken, OperatorToken, Input, BracketToken, Token } from "./App";

export { }

function input(str: string): Input {
  const input = new Input();
  str.split("").forEach(c => input.join(c));
  return input;
}

function tokensToString(tokens: ReadonlyArray<Token>): string {
  return tokens.map(t => t.text).join("");
}

test("Anything", () => {
  let i = input("2");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("2");

  // i = input("-");
  // i.calculate();
  // expect(tokensToString(i.getTokens())).toBe("-1");

  i = input("2+3*4");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("14");
  // expect(tokensToString(i.getPostfixTokens())).toBe("234*+");

  i = input("(2+3)*4");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("20");
  // expect(tokensToString(i.getPostfixTokens())).toBe("23+4*");

  i = input("2*(3+4)*5");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("70");
  // expect(tokensToString(i.getPostfixTokens())).toBe("234+*5*");

  i = input("3*(4+5)-6/2");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("24");
  // expect(tokensToString(i.getPostfixTokens())).toBe("345+*62/-");

  i = input("2*(3+(4*5))");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("46");
  // expect(tokensToString(i.getPostfixTokens())).toBe("2345*+*");

  i = input("((2+3)*4)-5");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("15");
  // expect(tokensToString(i.getPostfixTokens())).toBe("23+4*5-");

  i = input("2*3+4*5-6/2");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("23");
  // expect(tokensToString(i.getPostfixTokens())).toBe("23*45*+62/-");

  i = input("2*(3+4*(5-6/2))");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("22");
  // expect(tokensToString(i.getPostfixTokens())).toBe("234562/-*+*");

  i = input("2*(3+4)*(5-6)/2");
  i.calculate();
  expect(tokensToString(i.getTokens())).toBe("-7");
  // expect(tokensToString(i.getPostfixTokens())).toBe("234+*56-*2/");
});

test("NumberToken", () => {
  let c = new NumberToken(null as any);

  expect(c.join('0')).toBe(true);
  expect(c.join('0')).toBe(false);
  expect(c.join('1')).toBe(true);
  expect(c.join('2')).toBe(true);
  expect(c.text).toBe('12');

  c = new NumberToken(null as any);
  expect(c.join('0')).toBe(true);
  expect(c.join('0')).toBe(false);
  expect(c.join('.')).toBe(true);
  expect(c.join('1')).toBe(true);
  expect(c.text).toBe('0.1');

  c = new NumberToken(null as any);
  expect(c.join('1')).toBe(true);
  expect(c.join('2')).toBe(true);
  expect(c.text).toBe('12');

  c = new NumberToken(null as any);
  expect(c.join('0')).toBe(true);
  expect(c.join('.')).toBe(true);
  expect(c.join('.')).toBe(false);
  expect(c.join('1')).toBe(true);
  expect(c.text).toBe('0.1');

  c = new NumberToken(null as any);
  expect(c.join('-')).toBe(true);
  expect(c.join('0')).toBe(true);
  expect(c.text).toBe('-0.');

  c = new NumberToken(null as any);

  expect(c.join('1')).toBe(true);
  expect(c.join('2')).toBe(true);
  expect(c.join('3')).toBe(true);
  expect(c.join('.')).toBe(true);
  expect(c.join('4')).toBe(true);
  expect(c.join('5')).toBe(true);
  expect(c.join('6')).toBe(true);
  expect(c.join('.')).toBe(false);
  expect(c.join('7')).toBe(true);
  expect(c.text).toBe('123.4567');

  c = new NumberToken(null as any);

  expect(c.join('-')).toBe(true);
  expect(c.join('1')).toBe(true);
  expect(c.join('2')).toBe(true);
  expect(c.join('3')).toBe(true);
  expect(c.join('-')).toBe(false);
  expect(c.join('.')).toBe(true);
  expect(c.join('.')).toBe(false);
  expect(c.join('-')).toBe(false);
  expect(c.text).toBe('-123.');
});

test("Operator", () => {
  let c = new OperatorToken(null as any);

  expect(c.join('+')).toBe(true);
  expect(c.join('-')).toBe(true);
  expect(c.join('*')).toBe(true);
  expect(c.join('/')).toBe(true);
  expect(c.join('+')).toBe(true);
  expect(c.join('-')).toBe(true);
  expect(c.join('*')).toBe(true);
  expect(c.join('/')).toBe(true);
  expect(c.text).toBe('/');

  c = new OperatorToken(null as any);

  expect(c.join('1')).toBe(false);
  expect(c.join('2')).toBe(false);
  expect(c.join('3')).toBe(false);
  expect(c.join('.')).toBe(false);
  expect(c.join('4')).toBe(false);
  expect(c.join('5')).toBe(false);
  expect(c.join('6')).toBe(false);
  expect(c.join('.')).toBe(false);
  expect(c.join('7')).toBe(false);
  expect(c.text).toBe('');
});

test("Bracket", () => {
  let c = new BracketToken(null as any);

  expect(c.join('(')).toBe(true);
  expect(c.join(')')).toBe(false);
  expect(c.text).toBe('(');

  c = new BracketToken(null as any);

  expect(c.join('+')).toBe(false);
  expect(c.join('-')).toBe(false);
  expect(c.join('*')).toBe(false);
  expect(c.join('/')).toBe(false);
  expect(c.join('+')).toBe(false);
  expect(c.join('-')).toBe(false);
  expect(c.join('*')).toBe(false);
  expect(c.join('/')).toBe(false);
  expect(c.text).toBe('');

  c = new BracketToken(null as any);

  expect(c.join('1')).toBe(false);
  expect(c.join('2')).toBe(false);
  expect(c.join('3')).toBe(false);
  expect(c.join('.')).toBe(false);
  expect(c.join('4')).toBe(false);
  expect(c.join('5')).toBe(false);
  expect(c.join('6')).toBe(false);
  expect(c.join('.')).toBe(false);
  expect(c.join('7')).toBe(false);
  expect(c.text).toBe('');
});

test("Input", () => {
  let i = new Input();

  expect(i.join('+')).toBe(false);
  expect(i.join('*')).toBe(false);
  expect(i.join('/')).toBe(false);
  expect(i.join('0')).toBe(true);
  expect(i.join('1')).toBe(true);
  expect(i.join('2')).toBe(true);
  expect(i.join('.')).toBe(true);
  expect(i.join('3')).toBe(true);
  expect(i.join('+')).toBe(true);
  expect(i.join('-')).toBe(true);
  expect(i.join('*')).toBe(true);
  expect(i.join('/')).toBe(true);
  expect(i.join('4')).toBe(true);
  expect(i.join('.')).toBe(true);
  expect(i.join('-')).toBe(true);
  expect(i.join('5')).toBe(true);
  expect(i.join('+')).toBe(true);

  expect(i.getTokens().map(t => t.text)).toEqual(['', '12.3', '/', '4.', '-', '5', '+']);

  i = new Input();

  expect(i.join('-')).toBe(true);
  expect(i.join('1')).toBe(true);
  expect(i.join('.')).toBe(true);
  expect(i.join('2')).toBe(true);
  expect(i.join('3')).toBe(true);

  expect(i.getTokens().map(t => t.text)).toEqual(['', '-1.23']);
});
