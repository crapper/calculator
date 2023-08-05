import { NumberToken, OperatorToken, Input } from "./App";

export { }
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
