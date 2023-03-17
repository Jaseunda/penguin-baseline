interface Node {
    accept(visitor: Visitor): any;
  }
  
  interface Statement extends Node {}
  
  interface Expression extends Node {}
  
  class PrintStatement implements Statement {
    constructor(public readonly expression: Expression) {}
  
    accept(visitor: Visitor) {
      return visitor.visitPrintStatement(this);
    }
  }
  
  class ExpressionStatement implements Statement {
    constructor(public readonly expression: Expression) {}
  
    accept(visitor: Visitor) {
      return visitor.visitExpressionStatement(this);
    }
  }
  
  class BlockStatement implements Statement {
    constructor(public readonly statements: Statement[]) {}
  
    accept(visitor: Visitor) {
      return visitor.visitBlockStatement(this);
    }
  }
  
  class IfStatement implements Statement {
    constructor(public readonly condition: Expression, public readonly thenBranch: Statement, public readonly elseBranch: Statement) {}
  
    accept(visitor: Visitor) {
      return visitor.visitIfStatement(this);
    }
  }
  
  class WhileStatement implements Statement {
    constructor(public readonly condition: Expression, public readonly body: Statement) {}
  
    accept(visitor: Visitor) {
      return visitor.visitWhileStatement(this);
    }
  }
  
  class ForStatement implements Statement {
    constructor(public readonly initializer: Statement, public readonly condition: Expression, public readonly increment: Expression, public readonly body: Statement) {}
  
    accept(visitor: Visitor) {
      return visitor.visitForStatement(this);
    }
  }
  
  class ReturnStatement implements Statement {
    constructor(public readonly keyword: Token, public readonly value: Expression) {}
  
    accept(visitor: Visitor) {
      return visitor.visitReturnStatement(this);
    }
  }
  
  class VarDeclaration implements Statement {
    constructor(public readonly name: Token, public readonly initializer: Expression | null) {}
  
    accept(visitor: Visitor) {
      return visitor.visitVarDeclaration(this);
    }
  }
  
  class FunctionDeclaration implements Statement {
    constructor(public readonly name: Token, public readonly parameters: Token[], public readonly body: Statement[]) {}
  
    accept(visitor: Visitor) {
      return visitor.visitFunctionDeclaration(this);
    }
  }
  
  class Assignment implements Statement {
    constructor(public readonly name: Token, public readonly value: Expression) {}
  
    accept(visitor: Visitor) {
      return visitor.visitAssignment(this);
    }
  }
  
  class Logical implements Expression {
    constructor(public readonly left: Expression, public readonly operator: Token, public readonly right: Expression) {}
  
    accept(visitor: Visitor) {
      return visitor.visitLogical(this);
    }
  }
  
  class Binary implements Expression {
    constructor(public readonly left: Expression, public readonly operator: Token, public readonly right: Expression) {}
  
    accept(visitor: Visitor) {
      return visitor.visitBinary(this);
    }
  }
  
  class Unary implements Expression {
    constructor(public readonly operator: Token, public readonly right: Expression) {}
  
    accept(visitor: Visitor) {
      return visitor.visitUnary(this);
    }
  }
  
  class Call implements Expression {
    constructor(public readonly callee: Expression, public readonly paren: Token, public readonly arguments: Expression[]) {}
  
    accept(visitor: Visitor) {
      return visitor.visitCall(this);
    }
  }
  
  class Get implements Expression {
    constructor(public readonly object: Expression, public readonly name: Token) {}
  
    accept(visitor: Visitor) {
      return visitor.visitGet(this);
    }
  }
  
  class Set implements Expression {
    constructor(public readonly object: Expression, public readonly name: Token, public readonly value: Expression) {}
  
    accept(visitor: Visitor) {
      return visitor.visitSet(this);
    }
  }
  
  class This implements Expression {
    constructor(public readonly keyword: Token) {}
  
    accept(visitor: Visitor) {
      return visitor.visitThis(this);
    }
  }
  
  class Super implements Expression {
    constructor(public readonly keyword: Token, public readonly method: Token) {}
  
    accept(visitor: Visitor) {
      return visitor.visitSuper(this);
    }
  }
  
  class Literal implements Expression {
    constructor(public readonly value: any) {}
    accept(visitor: Visitor) {
        return visitor.visitLiteral(this);
      }
    }
    
    class Grouping implements Expression {
      constructor(public readonly expression: Expression) {}
    
      accept(visitor: Visitor) {
        return visitor.visitGrouping(this);
      }
    }
    
    class Variable implements Expression {
      constructor(public readonly name: Token) {}
    
      accept(visitor: Visitor) {
        return visitor.visitVariable(this);
      }
    }
    
    interface Visitor {
      visitPrintStatement(statement: PrintStatement): any;
      visitExpressionStatement(statement: ExpressionStatement): any;
      visitBlockStatement(statement: BlockStatement): any;
      visitIfStatement(statement: IfStatement): any;
      visitWhileStatement(statement: WhileStatement): any;
      visitForStatement(statement: ForStatement): any;
      visitReturnStatement(statement: ReturnStatement): any;
      visitVarDeclaration(statement: VarDeclaration): any;
      visitFunctionDeclaration(statement: FunctionDeclaration): any;
      visitAssignment(statement: Assignment): any;
      visitLogical(expression: Logical): any;
      visitBinary(expression: Binary): any;
      visitUnary(expression: Unary): any;
      visitCall(expression: Call): any;
      visitGet(expression: Get): any;
      visitSet(expression: Set): any;
      visitThis(expression: This): any;
      visitSuper(expression: Super): any;
      visitLiteral(expression: Literal): any;
      visitGrouping(expression: Grouping): any;
      visitVariable(expression: Variable): any;
    }
      