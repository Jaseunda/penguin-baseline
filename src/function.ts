import { Environment } from './environment';
import { Callable } from './types';
import { Statement } from './statements';

export class PenguinFunction implements Callable {
  constructor(public readonly declaration: Statement.Function, private readonly closure: Environment, public readonly isInitializer: boolean) {}

  arity() {
    return this.declaration.params.length;
  }

  call(interpreter: Interpreter, args: Value[]) {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      if (this.isInitializer) {
        return this.closure.getAt(0, 'this');
      }

      return returnValue;
    }

    if (this.isInitializer) {
      return this.closure.getAt(0, 'this');
    }

    return null;
  }

  bind(instance: PenguinInstance) {
    const environment = new Environment(this.closure);
    environment.define('this', instance);
    return new PenguinFunction(this.declaration, environment, this.isInitializer);
  }

  toString() {
    return `<fn ${this.declaration.name?.lexeme ?? 'anonymous'}>`;
  }
}

export class PenguinClass implements Callable {
  constructor(public readonly name: string, public readonly superclass: PenguinClass | null, public readonly methods: Map<string, PenguinFunction>) {}

  arity() {
    const initializer = this.findMethod('init');
    if (!initializer) {
      return 0;
    }

    return initializer.arity();
  }

  call(interpreter: Interpreter, args: Value[]) {
    const instance = new PenguinInstance(this);

    const initializer = this.findMethod('init');
    if (initializer) {
      initializer.bind(instance).call(interpreter, args);
    }

    return instance;
  }

  findMethod(name: string) {
    if (this.methods.has(name)) {
      return this.methods.get(name);
    }

    if (this.superclass) {
      return this.superclass.findMethod(name);
    }

    return undefined;
  }

  toString() {
    return this.name;
  }
}

export class PenguinInstance {
  private readonly fields = new Map<string, Value>();

  constructor(public readonly klass: PenguinClass) {}

  get(name: Token) {
    if (this.fields.has(name.lexeme)) {
      return this.fields.get(name.lexeme);
    }

    const method = this.klass.findMethod(name.lexeme);
    if (method) {
      return method.bind(this);
    }

    throw new PenguinError(name, `Undefined property '${name.lexeme}'.`);
  }

  set(name: Token, value: Value) {
    this.fields.set(name.lexeme, value);
  }

  toString() {
    return `${this.klass.name} instance`;
  }
}
