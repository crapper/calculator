import React from "react";
import './App.css';

export type Digit0to9 = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Digit1to9 = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Dot = '.';
export type Operator = '+' | '-' | '*' | '/' | '(' | ')';
export type Bracket = '(' | ')'

export function isDigit0to9(s: string): s is Digit0to9 {
  return s === '0' || s === '1' || s === '2' || s === '3' || s === '4' || s === '5' || s === '6' || s === '7' || s === '8' || s === '9';
}

export function isDigit1to9(s: string): s is Digit1to9 {
  return s === '1' || s === '2' || s === '3' || s === '4' || s === '5' || s === '6' || s === '7' || s === '8' || s === '9';
}

export function isDot(s: string): s is Dot {
  return s === '.';
}

export function isOperator(s: string): s is Operator {
  return s === '+' || s === '-' || s === '*' || s === '/';
}

export function isBracket(s: string): s is Bracket {
  return s === '(' || s === ')';
}

export function accept(...ignore: any[]): true {
  return true;
}

export function performExpression(a: NumberToken, b: NumberToken, c: OperatorToken): Number {
  switch (c.text) {
    case "+":
      return a.number + b.number;
    case "-":
      return a.number - b.number;
    case "*":
      return a.number * b.number;
    case "/":
      return a.number / b.number;
    default:
      return 0;
  }
}

export abstract class Token {
  constructor(protected input: Input) { }

  abstract join(char: string): boolean;

  abstract next(): Array<new (input: Input) => Token>;

  abstract get text(): string;

}

export class StartToken extends Token {
  private value: string = "0";

  constructor(input: Input) { super(input); }

  join(char: string): boolean {
    this.value = "";
    return false;
  }

  next() {
    return [NumberToken, BracketToken];
  }

  get text(): string {
    return this.value;
  }
}

export class NumberToken extends Token {
  private value: string = "";

  constructor(input: Input) { super(input); }

  join(char: string): boolean {
    if (this.value === "") {
      if (isDigit0to9(char)) return accept(this.value = char);
      if (isDot(char)) return accept(this.value = "0.");
      if (char === '-') return accept(this.value = "-");
    } else if (this.value === "0") {
      if (isDigit1to9(char)) return accept(this.value = char);
      if (isDot(char)) return accept(this.value = "0.");
    } else if (this.value === "-") {
      if (isDigit1to9(char)) return accept(this.value += char);
      if (char === '0' || isDot(char)) return accept(this.value = "-0.");
    } else {
      if (isDigit0to9(char)) return accept(this.value += char);
      if (isDot(char) && this.value.indexOf('.') === -1) return accept(this.value += '.');
    }
    return false;
  }

  next() {
    return [OperatorToken, BracketToken];
  }

  get text(): string {
    return this.value;
  }

  get number(): number {
    return this.value === "-" ? -1 : Number(this.value);
  }
}

export class OperatorToken extends Token {
  private value: string = "";
  private priority = -1;

  constructor(input: Input) { super(input); }

  join(char: string): boolean {
    if (isOperator(char)) {
      if (char === "+" || char === "-") {
        this.priority = 0
      } else if (char === "*" || char === "/") {
        this.priority = 1
      }
      this.value = char;
      return true;
    }
    return false;
  }

  next() {
    return [NumberToken, BracketToken];
  }

  get text(): string {
    return this.value;
  }

  get prior(): number {
    return this.priority
  }
}

export class BracketToken extends Token {
  private value: string = "";
  private priority = -1;

  constructor(input: Input) { super(input); }

  join(char: string): boolean {
    if (isBracket(char) && this.value === "") {
      this.priority = 2
      this.value = char;
      return true;
    }
    return false;
  }

  next() {
    // return [NumberToken, OperatorToken, BracketToken];
    if (this.value === "(")
      return [NumberToken, BracketToken];
    else
      return [OperatorToken, NumberToken, BracketToken];
  }

  get isOpening(): boolean {
    return this.value === "(";
  }

  get isClosing(): boolean {
    return this.value === ")";
  }

  get text(): string {
    return this.value;
  }

  get prior(): number {
    return this.priority
  }
}

export class Input {
  private tokens: Array<Token> = [new StartToken(this)];
  private postfix_tokens: Array<Token> = [];

  constructor(private onUpdate?: () => void) { }

  initialize() {
    this.tokens = [new StartToken(this)];
    this.postfix_tokens = []
    this.onUpdate?.();
  }

  hasBalancedBracket(): boolean {
    return this.tokens.filter(tok => tok.text === "(").length === this.tokens.filter(tok => tok.text === ")").length;
  }

  join(char: string): boolean {
    if (this.tokens.length === 0 || (char === ")" && this.hasBalancedBracket())) {
      return false;
    }

    const token = this.tokens[this.tokens.length - 1];

    if (token.join(char)) {
      this.onUpdate?.();
      return true;
    }
    const nextTokens = token.next();

    for (const nextToken of nextTokens) {
      const token = new nextToken(this);
      if (token.join(char)) {
        this.tokens.push(token);
        this.onUpdate?.();
        return true;
      }
    }

    return false;
  }

  validation() {
    if (this.tokens.length === 0) return false;

    if (this.tokens.at(-1) instanceof OperatorToken) return false;

    if (this.hasBalancedBracket() === false) return false;

    return true;
  }

  preCompile() {
    for (let i = 0; i < this.tokens.length; i++) {
      const current = this.tokens[i];
      if (current instanceof NumberToken) {
        const next = this.tokens[i + 1];
        if (next instanceof BracketToken && next.isOpening) {
          let mul = new OperatorToken(this);
          mul.join("*");
          this.tokens.splice(i + 1, 0, mul);
        }
      } else if (current instanceof BracketToken && current.isClosing) {
        const next = this.tokens[i + 1];
        if (next instanceof NumberToken) {
          let mul = new OperatorToken(this);
          mul.join("*");
          this.tokens.splice(i + 1, 0, mul);
        }
      }
    }
  }

  ToPostFix(): boolean {
    let temp_operator: Token[] = []
    let temp_bracket_len_count = 0
    for (let i = 0; i < this.tokens.length; i++) {
      if ((this.tokens[i] instanceof NumberToken)) {
        this.postfix_tokens.push(this.tokens[i])
      } else if ((this.tokens[i] instanceof OperatorToken || this.tokens[i] instanceof BracketToken)) {
        if (this.tokens[i].text === ')') {
          // temp_bracket_len_count = 0
          while (temp_operator.length !== 0) {
            if (temp_operator[temp_operator.length - 1].text !== '(') {
              this.postfix_tokens.push(temp_operator.pop()!)
              // temp_bracket_len_count++
            } else {
              temp_operator.pop()
              break
            }
          }
          // if (temp_bracket_len_count === 0){
          //   console.log("Error")
          //   this.initialize()
          //   return false
          // }
          continue
        }

        if (temp_operator.length === 0) {
          temp_operator.push(this.tokens[i])
          continue
        }

        while (temp_operator.length !== 0) {
          if ((temp_operator[temp_operator.length - 1] as OperatorToken).prior >= (this.tokens[i] as OperatorToken).prior && !(temp_operator[temp_operator.length - 1] instanceof BracketToken) && !(this.tokens[i] instanceof BracketToken)) {
            this.postfix_tokens.push(temp_operator.pop()!)
            if (temp_operator.length === 0) {
              temp_operator.push(this.tokens[i])
              break
            }
          } else {
            temp_operator.push(this.tokens[i])
            break
          }
        }
        continue
      }
    }
    this.postfix_tokens.push(...temp_operator.reverse())
    // console.log(this.postfix_tokens)
    return true
  }

  NumberToNumberToken(n: Number): NumberToken {
    let newToken = new NumberToken(null as any)
    for (let i = 0; i < String(n).length; i++) {
      newToken.join(String(n)[i])
    }
    return newToken
  }

  evaluation() {
    let temp_ans: Token[] = [];
    temp_ans.splice(0, temp_ans.length)
    for (let i = 0; i < this.postfix_tokens.length; i++) {
      if (this.postfix_tokens[i] instanceof NumberToken) {
        temp_ans.push(this.postfix_tokens[i])
      } else if (this.postfix_tokens[i] instanceof OperatorToken) {
        let b = temp_ans.pop() as NumberToken
        let a = temp_ans.pop() as NumberToken
        // console.log(a, b, this.postfix_tokens[i].text)
        let ans = performExpression(a, b, this.postfix_tokens[i] as OperatorToken)
        temp_ans.push(this.NumberToNumberToken(ans))
      }
      // console.log(...temp_ans)
    }
    this.tokens = temp_ans
  }

  calculate2() {
    if (!this.validation()) {
      console.log("Wrong Syntax");
      this.initialize();
      return;
    }

    this.preCompile();
    // console.log(this.tokens)
    this.ToPostFix()
    console.log(this.postfix_tokens)
    this.evaluation()
    // console.log(this.tokens)

    this.onUpdate?.();
  }

  calculate() {
    if (!this.validation()) {
      console.log("Wrong Syntax");
      this.initialize();
      return;
    }

    this.preCompile();

    const output: NumberToken[] = [];
    const stack: (BracketToken | OperatorToken)[] = []; // OpenBracket, Operator

    const peek = () => {
      return stack.at(-1);
    }

    const out = (token: NumberToken) => {
      output.push(token);
    }

    const handlePop = () => {
      const op = stack.pop()!;
      if (op instanceof BracketToken) return undefined;

      const b = output.pop()!;
      const a = output.pop()!;

      return performExpression(a, b, op);
    }

    const handleToken = (token: Token) => { // Number, Operator, OpenBracket  CloseBracket
      if (token instanceof NumberToken) {
        out(token);
      } else if (token instanceof OperatorToken) {
        const o1 = token;
        let o2 = peek();

        while (o2 instanceof OperatorToken && o1.prior <= o2.prior) {
          out(this.NumberToNumberToken(handlePop()!));
          o2 = peek();
        }

        stack.push(o1);
      } else if (token instanceof BracketToken) {
        if (token.isOpening) {
          stack.push(token);
        } else {
          let o2 = peek();
          while (!(o2 instanceof BracketToken)) {
            out(this.NumberToNumberToken(handlePop()!));
            o2 = peek();
          }
          stack.pop();
        }
      }
    }

    this.tokens.forEach(handleToken);

    // XXX
    if (stack.length > 0 && output.length < 2) {
      this.initialize();
      return;
    }

    while (stack.length > 0) {
      out(this.NumberToNumberToken(handlePop()!));
    }

    this.tokens = output;

    this.onUpdate?.();
  }

  getTokens(): ReadonlyArray<Token> {
    return this.tokens;
  }

  getPostfixTokens(): ReadonlyArray<Token> {
    return this.postfix_tokens;
  }

}

export function useUpdate() {
  const [update, setUpdate] = React.useState<boolean>(false);

  return function () {
    setUpdate((u) => !u);
  }
}

export default function App() {
  const updater = useUpdate();
  const [input, setInput] = React.useState<Input>(new Input(updater));

  return (<div className="App">
    <label>{
      input.getTokens().map((token, index) => {
        return <span key={index}>{token.text}</span>;
      })
    }</label>
    <div>
      <button className='Button' onClick={() => { input.join("(") }}>(</button>
      <button className='Button' onClick={() => { input.join(")") }}>)</button>
      <button className='Button'>%</button>
      <button className='Button' onClick={() => { setInput(new Input(updater)) }}>CE</button>
    </div>
    <div>
      <button className='Button' onClick={() => { input.join("7") }}>7</button>
      <button className='Button' onClick={() => { input.join("8") }}>8</button>
      <button className='Button' onClick={() => { input.join("9") }}>9</button>
      <button className='Button' onClick={() => { input.join("/") }}>÷</button>
    </div>
    <div>
      <button className='Button' onClick={() => { input.join("4") }}>4</button>
      <button className='Button' onClick={() => { input.join("5") }}>5</button>
      <button className='Button' onClick={() => { input.join("6") }}>6</button>
      <button className='Button' onClick={() => { input.join("*") }}>x</button>
    </div>
    <div>
      <button className='Button' onClick={() => { input.join("1") }}>1</button>
      <button className='Button' onClick={() => { input.join("2") }}>2</button>
      <button className='Button' onClick={() => { input.join("3") }}>3</button>
      <button className='Button' onClick={() => { input.join("-") }}>-</button>
    </div>
    <div>
      <button className='Button' onClick={() => { input.join("0") }}>0</button>
      <button className='Button' onClick={() => { input.join(".") }}>.</button>
      <button className='Button' onClick={() => { input.calculate() }}>=</button>
      <button className='Button' onClick={() => { input.join("+") }}>+</button>
    </div>
  </div>);
};

