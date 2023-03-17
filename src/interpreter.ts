import { RuntimeError } from './error';
import { Token } from './lexer';
import { Environment } from './environment';
import { Statement } from './statements';
import { Expression } from './expressions';

export class Interpreter implements Visitor<Value> {
  environment: Environment;

  constructor() {
    this.environment = new Environment();
  }

  interpret(statements: Statement[]) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        console.error(`Error: ${error.message} at line ${error.token.line}`);
      } else {
        console.error(error.message);
      }
    }
  }

  execute(statement: Statement) {
    statement.accept(this);
  }

  visitBlock(statement: Block) {
    const environment = new Environment(this.environment);
    this.environment = environment;
    try {
      for (const statement of statement.statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = environment.enclosing;
    }
  }

  visitClass(statement: Class) {
    let superclass = null;
    if (statement.superclass) {
      superclass = this.evaluate(statement.superclass);
      if (!(superclass instanceof PenguinClass)) {
        throw new RuntimeError(statement.superclass.name, 'Superclass must be a class.');
      }
    }
    this.environment.define(statement.name.lexeme, null);

    if (statement.superclass) {
      this.environment = new Environment(this.environment);
      this.environment.define('super', superclass);
    }

    const methods = new Map<string, PenguinFunction>();
    for (const method of statement.methods) {
      const fn = new PenguinFunction(method, this.environment, method.name.lexeme === 'init');
      methods.set(method.name.lexeme, fn);
    }

    const klass = new PenguinClass(statement.name.lexeme, superclass as PenguinClass, methods);

    if (superclass) {
      this.environment = this.environment.enclosing!;
    }

    this.environment.assign(statement.name, klass);
  }

  visitExpression(statement: ExpressionStatement) {
    this.evaluate(statement.expression);
  }

  visitFunction(statement: FunctionStatement) {
    const fn = new PenguinFunction(statement, this.environment, false);
    this.environment.define(statement.name.lexeme, fn);
  }

  visitIf(statement: IfStatement) {
    if (this.isTruthy(this.evaluate(statement.condition))) {
      this.execute(statement.thenBranch);
    } else if (statement.elseBranch) {
      this.execute(statement.elseBranch);
    }
  }

  visitPrint(statement: PrintStatement) {
    const value = this.evaluate(statement.expression);
    console.log(this.stringify(value));
  }

  visitReturn(statement: ReturnStatement) {
    let value = null;
    if (statement.value) {
      value = this.evaluate(statement.value);
    }
    throw new Return(value);
  }

  visitVar(statement: VarStatement) {
    let value = null;
    if (statement.initializer) {
      value = this.evaluate(statement.initializer);
    }
    this.environment.define(statement.name.lexeme, value);
  }

  visitWhile(statement: WhileStatement) {
    while (this.isTruthy(this.evaluate(statement.condition))) {
      this.execute(statement.body);
    }
  }

  visitAssign(expression: Assign) {
    const value = this.evaluate(expression.value);
    const distance = this.locals.get(expression);
    if (distance !== undefined) {
      this.environment.assignAt(distance, expression.name, value);
    } else {
      this.globals.assign(expression.name, value);
    }
    return value;
  }

  visitBinary(expression: Binary) {
    const left = this.evaluate(expression.left);
    const right = this.evaluate(expression.right);

    switch (expression.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperands(expression.operator, left, right);
        return (left as number) - (
            right as number);
            case TokenType.SLASH:
              this.checkNumberOperands(expression.operator, left, right);
              return (left as number) / (right as number);
            case TokenType.STAR:
              this.checkNumberOperands(expression.operator, left, right);
              return (left as number) * (right as number);
            case TokenType.PLUS:
              if (typeof left === 'number' && typeof right === 'number') {
                return left + right;
              }
              if (typeof left === 'string' && typeof right === 'string') {
                return left + right;
              }
              throw new RuntimeError(expression.operator, 'Operands must be two numbers or two strings.');
            case TokenType.GREATER:
              this.checkNumberOperands(expression.operator, left, right);
              return (left as number) > (right as number);
            case TokenType.GREATER_EQUAL:
              this.checkNumberOperands(expression.operator, left, right);
              return (left as number) >= (right as number);
            case TokenType.LESS:
              this.checkNumberOperands(expression.operator, left, right);
              return (left as number) < (right as number);
            case TokenType.LESS_EQUAL:
              this.checkNumberOperands(expression.operator, left, right);
              return (left as number) <= (right as number);
            case TokenType.BANG_EQUAL:
              return !this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL:
              return this.isEqual(left, right);
            default:
              throw new Error('Unknown operator type');
          }
        }
      
        visitCall(expression: Call) {
          const callee = this.evaluate(expression.callee);
      
          const args = [];
          for (const arg of expression.args) {
            args.push(this.evaluate(arg));
          }
      
          if (!(callee instanceof PenguinCallable)) {
            throw new RuntimeError(expression.paren, 'Can only call functions and classes.');
          }
      
          const fn = callee as PenguinCallable;
          if (args.length !== fn.arity()) {
            throw new RuntimeError(
              expression.paren,
              `Expected ${fn.arity()} arguments but got ${args.length}.`
            );
          }
      
          return fn.call(this, args);
        }
      
        visitGet(expression: Get) {
          const object = this.evaluate(expression.object);
          if (object instanceof PenguinInstance) {
            return object.get(expression.name);
          }
      
          throw new RuntimeError(expression.name, 'Only instances have properties.');
        }
      
        visitGrouping(expression: Grouping) {
          return this.evaluate(expression.expression);
        }
      
        visitLiteral(expression: Literal) {
          return expression.value;
        }
      
        visitLogical(expression: Logical) {
          const left = this.evaluate(expression.left);
      
          if (expression.operator.type === TokenType.OR) {
            if (this.isTruthy(left)) {
              return left;
            }
          } else {
            if (!this.isTruthy(left)) {
              return left;
            }
          }
      
          return this.evaluate(expression.right);
        }
      
        visitSet(expression: Set) {
          const object = this.evaluate(expression.object);
          if (!(object instanceof PenguinInstance)) {
            throw new RuntimeError(expression.name, 'Only instances have fields.');
          }
      
          const value = this.evaluate(expression.value);
          object.set(expression.name, value);
          return value;
        }
      
        visitSuper(expression: Super) {
          const distance = this.locals.get(expression)!;
          const superclass = this.environment.getAt(distance, 'super') as PenguinClass;
      
          const object = this.environment.getAt(distance - 1, 'this') as PenguinInstance;
      
          const method = superclass.findMethod(expression.method.lexeme);
      
          if (!method) {
            throw new RuntimeError(expression.method
                , `Undefined property '${expression.method.lexeme}'.`);
            }
        
            return method.bind(object);
          }
        
          visitThis(expression: This) {
            return this.lookupVariable(expression.keyword, expression);
          }
        
          private lookupVariable(name: Token, expression: Expression) {
            const distance = this.locals.get(expression);
            if (distance !== undefined) {
              return this.environment.getAt(distance, name.lexeme);
            } else {
              return this.globals.get(name);
            }
          }
        
          private evaluate(expr: Expression): Value {
            return expr.accept(this);
          }
        
          private execute(stmt: Statement) {
            stmt.accept(this);
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
            throw new RuntimeError(operator, 'Operand must be a number.');
          }
        
          private checkNumberOperands(operator: Token, left: Value, right: Value) {
            if (typeof left === 'number' && typeof right === 'number') {
              return;
            }
            throw new RuntimeError(operator, 'Operands must be numbers.');
          }
        }
              