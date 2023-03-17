import { AstPrinter } from './ast';
import { Visitor } from './expressions';
import { PenguinCallable, PenguinClass, PenguinFunction, PenguinInstance, Value } from './types';
import { Environment } from './environment';
import { Statement } from './statements';
import { PenguinError, RuntimeError } from './error';

export class Runtime implements Visitor<PenguinCallable>, Statement[] {
  private globals = new Environment();
  private environment = this.globals;
  private locals = new Map<PenguinCallable, number>();

  constructor() {
    this.globals.define('clock', new class implements PenguinCallable {
      arity() {
        return 0;
      }

      call() {
        return Date.now() / 1000.0;
      }

      toString() {
        return '<native fn>';
      }
    });
  }

  compile(statements: Statement[]) {
    let compiledCode = '';
    for (const stmt of statements) {
      compiledCode += this.compileStatement(stmt);
    }

    return compiledCode;
  }

  interpret(statements: Statement[]) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof PenguinError) {
        console.error(`Error: ${error.message} at line ${error.token.line}`);
      } else {
        console.error(error.message);
      }
    }
  }

  executeBlock(statements: Statement[], environment: Environment) {
    const previous = this.environment;

    try {
      this.environment = environment;

      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  resolve(expr: Expression, depth: number) {
    this.locals.set(expr, depth);
  }

  visitFunction(functionStmt: PenguinFunction) {
    const func = new PenguinFunction(functionStmt, this.environment);
    this.environment.define(functionStmt.name.lexeme, func);
    return func;
  }

  visitClass(classStmt: PenguinClass)
  {
    let superclass: Value = null;
    if (classStmt.superclass !== null) {
      superclass = this.evaluate(classStmt.superclass);
      if (!(superclass instanceof PenguinClass)) {
        throw new RuntimeError(classStmt.superclass.name, 'Superclass must be a class.');
      }
    }

    this.environment.define(classStmt.name.lexeme, null);

    if (classStmt.superclass !== null) {
      this.environment = new Environment(this.environment);
      this.environment.define('super', superclass);
    }

    const methods = new Map<string, PenguinFunction>();
    for (const method of classStmt.methods) {
      const func = new PenguinFunction(method, this.environment, method.name.lexeme === 'init');
      methods.set(method.name.lexeme, func);
    }

    const klass = new PenguinClass(classStmt.name.lexeme, superclass, methods);

    if (superclass !== null) {
      this.environment = this.environment.enclosing!;
    }

    this.environment.assign(classStmt.name, klass);
    return klass;
  }

  visitInstance(instanceStmt: PenguinInstance) {
    const klass = this.evaluate(instanceStmt.class);

    if (!(klass instanceof PenguinClass)) {
      throw new RuntimeError(instanceStmt.class.name, 'Class name must be a class.');
    }

    const instance = new PenguinInstance(klass);
    this.environment.define(instanceStmt.name.lexeme, instance);

    for (const method of klass.methods.values()) {
      const boundMethod = method.bind(instance);
      this.environment.define(method.name.lexeme, boundMethod);
    }

    return instance;
  }

  visitExpressionStatement(expressionStmt: Expression) {
    this.evaluate(expressionStmt);
  }

  visitPrintStatement(printStmt: Expression) {
    const value = this.evaluate(printStmt);
    console.log(this.stringify(value));
  }

  visitVarStatement(varStmt: { name: Token; initializer: Expression | null }) {
    let value: Value = null;
    if (varStmt.initializer !== null) {
      value = this.evaluate(varStmt.initializer);
    }

    this.environment.define(varStmt.name.lexeme, value);
  }

  visitBlockStatement(blockStmt: Statement[]) {
    this.executeBlock(blockStmt, new Environment(this.environment));
  }

  visitIfStatement(ifStmt: {
    condition: Expression;
    thenBranch: Statement;
    elseBranch: Statement | null;
  }) {
    if (this.isTruthy(this.evaluate(ifStmt.condition))) {
      this.execute(ifStmt.thenBranch);
    } else if (ifStmt.elseBranch !== null) {
      this.execute(ifStmt.elseBranch);
    }
  }

  visitWhileStatement(whileStmt: { condition: Expression; body: Statement }) {
    while (this.isTruthy(this.evaluate(whileStmt.condition))) {
      this.execute(whileStmt.body);
    }
  }

  visitFunctionStatement(functionStmt: PenguinFunction) {
    this.environment.define(functionStmt.name.lexeme, this.visitFunction(functionStmt));
  }

  visitReturnStatement(returnStmt: { keyword: Token; value: Expression | null }) {
    let value: Value = null;
    if (returnStmt.value !== null) {
      value = this.evaluate(returnStmt.value);
    }

    throw new PenguinFunctionReturnValue(value);
  }

  visitBreakStatement(breakStmt: Token) {
    throw new PenguinBreakError();
  }

  visitContinueStatement(continueStmt: Token) {
    throw new PenguinContinueError();
  }

  private evaluate(expr: Expression): Value {
    return expr.accept(this);
  }

  private execute(stmt: Statement) {
    stmt.accept(this);
  }

  private stringify(object: Value) {
    if (object === null) {
      return 'nil';
    }

    if (typeof object === 'boolean') {
      return object ? 'true' : 'false';
    }

    if (typeof object === 'number') {
      return object.toString();
    }

    if (typeof object === 'string') {
      return `"${object}"`;
    }

    if (object instanceof PenguinFunction || object instanceof PenguinClass || object instanceof PenguinInstance) {
      return object.toString();
    }

    return JSON.stringify(object);
  }

  private isTruthy(object: Value) {
    if (object === null) {
      return false;
    }

    if (typeof object === 'boolean') {
      return object;
    }

    return true;
  }

  private isEqual(a: Value, b: Value) {
    if (a === null && b === null) {
      return true;
    }

    if (a === null) {
      return false;
    }

    return a === b;
  }

  private checkNumberOperand(operator: Token, operand: Value) {
    if (typeof operand === 'number') {
      return;
    }

    throw new PenguinError(operator, 'Operand must be a number.');
  }

  private checkNumberOperands(operator: Token, left: Value, right: Value) {
    if (typeof left === 'number' && typeof right === 'number') {
      return;
    }

    throw new PenguinError(operator, 'Operands must be numbers.');
  }

  private checkStringOperand(operator: Token, operand: Value) {
    if (typeof operand === 'string') {
      return;
    }

    throw new PenguinError(operator, 'Operand must be a string.');
  }

  private executeBlock(statements: Statement[], environment: Environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  private visitFunction(func: PenguinFunction) {
    return new PenguinFunction(func.declaration, this.environment, false);
  }

  private call(callExpr: Call) {
    const callee = this.evaluate(callExpr.callee);
    const args: Value[] = [];
    for (const arg of callExpr.args) {
      args.push(this.evaluate(arg));
    }

    if (!(callee instanceof PenguinCallable)) {
      throw new PenguinError(callExpr.paren, 'Can only call functions and classes.');
    }

    if (args.length !== callee.arity()) {
      throw new PenguinError(callExpr.paren, `Expected ${callee.arity()} arguments but got ${args.length}.`);
    }

    return callee.call(this, args);
  }
}
