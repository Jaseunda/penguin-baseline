import { Token } from './lexer';

interface Expression {
  accept<T>(visitor: Visitor<T>): T;
}

class Binary implements Expression {
  constructor(public readonly left: Expression, public readonly operator: Token, public readonly right: Expression) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBinary(this);
  }
}

class Unary implements Expression {
  constructor(public readonly operator: Token, public readonly right: Expression) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnary(this);
  }
}

class Logical implements Expression {
  constructor(public readonly left: Expression, public readonly operator: Token, public readonly right: Expression) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitLogical(this);
  }
}

class Call implements Expression {
  constructor(public readonly callee: Expression, public readonly paren: Token, public readonly args: Expression[]) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitCall(this);
  }
}

class Get implements Expression {
  constructor(public readonly object: Expression, public readonly name: Token) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGet(this);
  }
}

class Set implements Expression {
  constructor(public readonly object: Expression, public readonly name: Token, public readonly value: Expression) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitSet(this);
  }
}

class This implements Expression {
  constructor(public readonly keyword: Token) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitThis(this);
  }
}

class Super implements Expression {
  constructor(public readonly keyword: Token, public readonly method: Token) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitSuper(this);
  }
}

interface Visitor<T> {
  visitLogical(expression: Logical): T;
  visitBinary(expression: Binary): T;
  visitUnary(expression: Unary): T;
  visitCall(expression: Call): T;
  visitGet(expression: Get): T;
  visitSet(expression: Set): T;
  visitThis(expression: This): T;
  visitSuper(expression: Super): T;
}
