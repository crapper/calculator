import React from "react";
import './App.css';

export type Digit0to9 = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Digit1to9 = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Dot = '.';
export type Operator = '+' | '-' | '*' | '/';

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

export function accept(...ignore: any[]): true {
  return true;
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
    return [NumberToken];
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
    return [OperatorToken];
  }

  get text(): string {
    return this.value;
  }
}

export class OperatorToken extends Token {
  private value: string = "";

  constructor(input: Input) { super(input); }

  join(char: string): boolean {
    if (isOperator(char)) {
      this.value = char;
      return true;
    }
    return false;
  }

  next() {
    return [NumberToken];
  }

  get text(): string {
    return this.value;
  }
}

export class Input {
  private tokens: Array<Token> = [new StartToken(this)];

  constructor(private onUpdate?: () => void) { }

  join(char: string): boolean {
    if (this.tokens.length === 0) {
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

  calculate(): number {
    const tokens = this.tokens.slice();

    // TODO

    return 0;
  }

  getTokens(): ReadonlyArray<Token> {
    return this.tokens;
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
        <button className='Button'>(</button>
        <button className='Button'>)</button>
        <button className='Button'>%</button>
        <button className='Button' onClick={() => {setInput(new Input(updater))}}>CE</button>
      </div>
      <div>
        <button className='Button' onClick={() => {input.join("7")}}>7</button>
        <button className='Button' onClick={() => {input.join("8")}}>8</button>
        <button className='Button' onClick={() => {input.join("9")}}>9</button>
        <button className='Button' onClick={() => {input.join("/")}}>÷</button>
      </div>
      <div>
        <button className='Button' onClick={() => {input.join("4")}}>4</button>
        <button className='Button' onClick={() => {input.join("5")}}>5</button>
        <button className='Button' onClick={() => {input.join("6")}}>6</button>
        <button className='Button' onClick={() => {input.join("*")}}>x</button>
      </div>
      <div>
        <button className='Button' onClick={() => {input.join("1")}}>1</button>
        <button className='Button' onClick={() => {input.join("2")}}>2</button>
        <button className='Button' onClick={() => {input.join("3")}}>3</button>
        <button className='Button' onClick={() => {input.join("-")}}>-</button>
      </div>
      <div>
        <button className='Button' onClick={() => {input.join("0")}}>0</button>
        <button className='Button' onClick={() => {input.join(".")}}>.</button>
        <button className='Button' onClick={() => {}}>=</button>
        <button className='Button' onClick={() => {input.join("+")}}>+</button>
      </div>
    </div>);
};



// import { useState } from 'react';
// import './App.css';












// enum Status{
//   number, cutter, dotnumber
// }

// interface IState{
//   text : string;
//   stat : Status;
// }

// class Items implements IState{
//   text: string;
//   stat: Status;

//   constructor(text: string, stat: Status){
//     this.text = text;
//     this.stat = stat;
//   }

//   public addBack(s: string){
//     this.text += s;
//   }

//   public toNumber() {
//     return Number(this.text); // NaN if not a number
//   }
// }

// function App() {
//   const [textstr, setTextstr] = useState('0');
//   const [lstItems,] = useState<Items[]>([]);

//   function isCutterSymbol(s: string){
//     return s === '+' || s === '*' || s === '/' || s === '-';
//   }

//   function isPositive(s: string){
//     return s === '+';
//   }  

//   function isNegative(s: string){
//     return s === '-';
//   }

//   function isDot(s: string){
//     return s === '.';
//   }

//   function ReRenderText(){
//     console.log(lstItems);
//     let s = '';
//     lstItems.forEach((item) => {
//       s += item.text;
//     });
//     if (s === '') s = '0';
//     setTextstr(s);
//   }

//   function add(s: string)
//   {
//     // case 1 [] input -9, case 2 9 x - 10
//     if (lstItems.length === 0 || (lstItems[lstItems.length - 1].stat === Status.cutter && !isNegative(lstItems[lstItems.length - 1].text))) {
//       if (isNegative(s)) {
//         if (lstItems.length !== 0 && isPositive(lstItems[lstItems.length - 1].text) && lstItems[lstItems.length - 1].stat !== Status.dotnumber) {
//           lstItems.pop();
//         }
//         lstItems.push(new Items(s, Status.number));
//         ReRenderText()
//         return;
//       }
//     }
//     if (isDot(s)) {
//       if (lstItems.length !==0 && lstItems[lstItems.length - 1].stat === Status.dotnumber) {
//         return;
//       }
//       console.log("1")
//       if (lstItems.length === 0) {
//         console.log("2")
//         lstItems.push(new Items('0.', Status.dotnumber));
//         ReRenderText()
//         return;
//       }
//       else if (lstItems[lstItems.length - 1].stat === Status.number && !isNaN(lstItems[lstItems.length - 1].toNumber())) {
//         console.log("3")
//         lstItems[lstItems.length - 1].addBack(s);
//         lstItems[lstItems.length - 1].stat = Status.dotnumber;
//         ReRenderText()
//         return;
//       }else{
//         console.log("4")
//         lstItems.push(new Items('.', Status.dotnumber));
//         ReRenderText()
//         return;
//       }
//     }

//     if (isCutterSymbol(s)) {
//       if (lstItems.length!==0 && lstItems[lstItems.length - 1].stat === Status.number && isNegative(lstItems[lstItems.length - 1].text) && lstItems[lstItems.length - 1].stat !== Status.dotnumber) {
//         lstItems.pop()
//         if (lstItems.length !== 0 && lstItems[lstItems.length - 1].stat !== Status.cutter) { //for case 9 x - 10 -> remove - and do not add new +
//           lstItems.push(new Items(s, Status.cutter));
//         }
//         ReRenderText()
//         return
//       }

//       if (lstItems.length!==0 && isNaN(lstItems[lstItems.length - 1].toNumber()) && lstItems[lstItems.length - 1].stat !== Status.dotnumber) {
//         lstItems.pop()
//         lstItems.push(new Items(s, Status.cutter));
//         ReRenderText()
//         return
//       }

//       if (lstItems.length === 0) {
//         lstItems.push(new Items('0', Status.number));
//         lstItems.push(new Items(s, Status.cutter));
//         ReRenderText()
//         return
//       }
//       lstItems.push(new Items(s, Status.cutter));
//       ReRenderText()
//       return
//     }
//     else {
//       if (lstItems.length === 0 || lstItems[lstItems.length - 1].stat === Status.cutter) {
//         lstItems.push(new Items(s, Status.number));
//         ReRenderText()
//       }
//       else {
//         if (lstItems[lstItems.length - 1].text === '0' && s === '0') return;
//         if (lstItems[lstItems.length - 1].text === '0')
//           lstItems[lstItems.length - 1].text = s
//         else
//           lstItems[lstItems.length - 1].addBack(s);
//         ReRenderText()
//       }
//     }
//   }

//   function validate(lst: Items[]){
//     if (lst.length === 0) return true;
    
//     for (let i = 0; i < lst.length; i++) {
//       //Get a "-", "." number type
//       if ((lst[i].stat === Status.number || lst[i].stat === Status.dotnumber) && isNaN(lst[i].toNumber())) {
//         return false;
//       }
//       if (lst[i].stat === Status.cutter && lst[i+1] === undefined) {
//         return false;
//       }
//     }
//     return true;
//   }

//   function calculate(){
//     if (!validate(lstItems)) {
//       console.error("Invalid input");
//       clear();
//       return;
//     }
//     var tempMulpDivPos: number[] = [];
//     for (let i = 0; i < lstItems.length; i++) {
//         if (lstItems[i].stat === Status.cutter && lstItems[i].text === '*' || lstItems[i].text === '/') {
//           tempMulpDivPos.push(i);
//         }
//     }
//     for (let i = 0; i < tempMulpDivPos.length; i++) {
//       let temp = tempMulpDivPos[i];
//       let a = lstItems[temp - 1].toNumber();
//       let b = lstItems[temp + 1].toNumber();
//       let c = 0;
//       if (lstItems[temp].text === '*') {
//         c = a * b;
//       }
//       else {
//         c = a / b;
//         if (b === 0) {
//           console.error("Divide by zero");
//           clear();
//           return;
//         }
//       }
//       lstItems.splice(temp - 1, 3, new Items(c.toString(), Status.number));
//     }

//     var tempAddSubPos: number[] = [];
//     for (let i = 0; i < lstItems.length; i++) {
//         if (lstItems[i].stat === Status.cutter && lstItems[i].text === '+' || lstItems[i].text === '-') {
//           tempAddSubPos.push(i);
//         }
//     }
//     for (let i = 0; i < tempAddSubPos.length; i++) {
//       let temp = tempAddSubPos[i];
//       let a = lstItems[temp - 1].toNumber();
//       let b = lstItems[temp + 1].toNumber();
//       let c = 0;
//       if (lstItems[temp].text === '+') {
//         c = a + b;
//       }
//       else {
//         c = a - b;
//       }
//       lstItems.splice(temp - 1, 3, new Items(c.toString(), Status.number));
//     }
//     setTextstr(Number(lstItems[0].text).toFixed(2));
//   }
  

//   function clear(){
//     lstItems.splice(0, lstItems.length);
//     setTextstr('0');
//   }

//   return (
//     <div className="App">
//       <label>{textstr}</label>
//       <div>
//         <button className='Button'>(</button>
//         <button className='Button'>)</button>
//         <button className='Button'>%</button>
//         <button className='Button' onClick={() => {clear()}}>CE</button>
//       </div>
//       <div>
//         <button className='Button' onClick={() => {add("7")}}>7</button>
//         <button className='Button' onClick={() => {add("8")}}>8</button>
//         <button className='Button' onClick={() => {add("9")}}>9</button>
//         <button className='Button' onClick={() => {add("/")}}>÷</button>
//       </div>
//       <div>
//         <button className='Button' onClick={() => {add("4")}}>4</button>
//         <button className='Button' onClick={() => {add("5")}}>5</button>
//         <button className='Button' onClick={() => {add("6")}}>6</button>
//         <button className='Button' onClick={() => {add("*")}}>x</button>
//       </div>
//       <div>
//         <button className='Button' onClick={() => {add("1")}}>1</button>
//         <button className='Button' onClick={() => {add("2")}}>2</button>
//         <button className='Button' onClick={() => {add("3")}}>3</button>
//         <button className='Button' onClick={() => {add("-")}}>-</button>
//       </div>
//       <div>
//         <button className='Button' onClick={() => {add("0")}}>0</button>
//         <button className='Button' onClick={() => {add(".")}}>.</button>
//         <button className='Button' onClick={() => {calculate()}}>=</button>
//         <button className='Button' onClick={() => {add("+")}}>+</button>
//       </div>
      
      
//       {/* <button onClick={() => {add()}}>=</button> */}

//       {/* <div>
//         {
//           lstItems.map((item) => item.text)
//         }
//       </div> */}
//     </div>
//   );
// }

