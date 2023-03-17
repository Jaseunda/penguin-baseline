import { Expression } from './expressions';
import { Token } from './lexer';

interface Statement {
  accept<T>(visitor: Visitor<T>): T;
}

class PrintStatement implements Statement {
  constructor(public readonly expression: Expression) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitPrintStatement(this);
  }
}

class ExpressionStatement implements Statement {
  constructor(public readonly expression: Expression) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitExpressionStatement(this);
  }
}

class BlockStatement implements Statement {
  constructor(public readonly statements: Statement[]) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBlockStatement(this);
  }
}

class IfStatement implements Statement {
  constructor(public readonly condition: Expression, public readonly thenBranch: Statement, public readonly elseBranch: Statement | null) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIfStatement(this);
  }
}

class WhileStatement implements Statement {
  constructor(public readonly condition: Expression, public readonly body: Statement) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitWhileStatement(this);
  }
}

class ForStatement implements Statement {
  constructor(public readonly initializer: Statement | null, public readonly condition: Expression | null, public readonly increment: Expression | null, public readonly body: Statement) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitForStatement(this);
  }
}

class ReturnStatement implements Statement {
  constructor(public readonly keyword: Token, public readonly value: Expression | null) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitReturnStatement(this);
  }
}

class BreakStatement implements Statement {
  constructor(public readonly keyword: Token) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBreakStatement(this);
  }
}

class ContinueStatement implements Statement {
  constructor(public readonly keyword: Token) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitContinueStatement(this);
  }
}

class VarStatement implements Statement {
  constructor(public readonly name: Token, public readonly initializer: Expression | null) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVarStatement(this);
  }
}

class FunctionStatement implements Statement {
  constructor(public readonly name: Token, public readonly parameters: Token[], public readonly body: Statement[]) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionStatement(this);
  }
}

interface Visitor<T> {
  visitPrintStatement(statement: PrintStatement): T;
  visitExpressionStatement(statement: ExpressionStatement): T;
  visitBlockStatement(statement: BlockStatement): T;
  visitIfStatement(statement: IfStatement): T;
  visitWhileStatement(statement: WhileStatement): T;
  visitForStatement(statement: ForStatement): T;
  visitReturnStatement(statement: ReturnStatement): T;
  visitBreakStatement(statement: BreakStatement): T;
  visitContinueStatement(statement: ContinueStatement): T;
  visitVarStatement(statement: VarStatement): T;
  visitFunctionStatement(statement: FunctionStatement): T;
}
