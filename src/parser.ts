import { Token, TokenType } from "./types";
import { Expression, Binary, Grouping, Literal, Unary } from "./expressions";
import { Statement, ExpressionStatement, PrintStatement } from "./statements";

class Parser {
  private readonly tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Statement[] {
    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }

    return statements;
  }

  private declaration(): Statement {
    try {
      if (this.match(TokenType.PRINT)) {
        return this.printStatement();
      }

      return this.statement();
    } catch (error) {
      this.synchronize();
      return null;
    }
  }

  private statement(): Statement {
    if (this.match(TokenType.LEFT_BRACE)) return this.blockStatement();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();

    return this.expressionStatement();
  }

  private printStatement(): Statement {
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new PrintStatement(value);
  }

  private blockStatement(): Statement {
    const statements: Statement[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  private ifStatement(): Statement {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

    const thenBranch = this.statement();
    let elseBranch = null;

    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new IfStatement(condition, thenBranch, elseBranch);
  }

  private whileStatement(): Statement {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
    const body = this.statement();

    return new WhileStatement(condition, body);
  }

  private forStatement(): Statement {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

    let initializer;
    if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

    let increment = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

    let body = this.statement();

    if (increment != null) {
      body = new BlockStatement([body, new ExpressionStatement(increment)]);
    }

    if (condition == null) {
      condition = new Literal(true);
    }
    body = new WhileStatement(condition, body);

    if (initializer != null) {
      body = new BlockStatement([initializer, body]);
      return body;
    }
  
    private returnStatement(): Statement {
      const keyword = this.previous();
      let value = null;
  
      if (!this.check(TokenType.SEMICOLON)) {
        value = this.expression();
      }
  
      this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
      return new ReturnStatement(keyword, value);
    }
  
    private expressionStatement(): Statement {
      const expr = this.expression();
      this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
      return new ExpressionStatement(expr);
    }
  
    private expression(): Expression {
      return this.assignment();
    }
  
    private assignment(): Expression {
      const expr = this.or();
  
      if (this.match(TokenType.EQUAL)) {
        const equals = this.previous();
        const value = this.assignment();
  
        if (expr instanceof Variable) {
          const name = expr.name;
          return new Assignment(name, value);
        }
  
        throw new Error(`Invalid assignment target at line ${equals.line}.`);
      }
  
      return expr;
    }
  
    private or(): Expression {
      let expr = this.and();
  
      while (this.match(TokenType.OR)) {
        const operator = this.previous();
        const right = this.and();
        expr = new Logical(expr, operator, right);
      }
  
      return expr;
    }
  
    private and(): Expression {
      let expr = this.equality();
  
      while (this.match(TokenType.AND)) {
        const operator = this.previous();
        const right = this.equality();
        expr = new Logical(expr, operator, right);
      }
  
      return expr;
    }
  
    private equality(): Expression {
      let expr = this.comparison();
  
      while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
        const operator = this.previous();
        const right = this.comparison();
        expr = new Binary(expr, operator, right);
      }
  
      return expr;
    }
  
    private comparison(): Expression {
      let expr = this.term();
  
      while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
        const operator = this.previous();
        const right = this.term();
        expr = new Binary(expr, operator, right);
      }
  
      return expr;
    }
  
    private term(): Expression {
      let expr = this.factor();
  
      while (this.match(TokenType.MINUS, TokenType.PLUS)) {
        const operator = this.previous();
        const right = this.factor();
        expr = new Binary(expr, operator, right);
      }
  
      return expr;
    }
  
    private factor(): Expression {
      let expr = this.unary();
  
      while (this.match(TokenType.SLASH, TokenType.STAR)) {
        const operator = this.previous();
        const right = this.unary();
        expr = new Binary(expr, operator, right);
      }
  
      return expr;
    }
  
    private unary(): Expression {
      if (this.match(TokenType.BANG, TokenType.MINUS)) {
        const operator = this.previous();
        const right = this.unary();
        return new Unary(operator, right);
      }
  
      return this.primary();
    }
  
    private primary(): Expression {
      if (this.match(TokenType.FALSE)) return new Literal(false);
      if (this.match(TokenType.TRUE)) return new Literal(true);
      if (this.match(TokenType.NIL)) return new Literal(null);
  
      if (this.match(TokenType.NUMBER, TokenType.STRING)) {
        return new Literal(this.previous().literal);
      }
  
      if (this.match(TokenType.IDENTIFIER)) {
        return new Variable(this.previous());
      }
  
      if (this.match(TokenType.LEFT_PAREN)) {
        const expr = this.expression();
        this.consume(TokenType.RIGHT_P
            return new Grouping(expr);
        }
    
        throw new Error(`Unexpected token ${this.peek().lexeme} at line ${this.peek().line}.`);
      }
    
      private match(...types: TokenType[]): boolean {
        for (const type of types) {
          if (this.check(type)) {
            this.advance();
            return true;
          }
        }
    
        return false;
      }
    
      private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
    
        throw new Error(`${message} at line ${this.peek().line}.`);
      }
    
      private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
      }
    
      private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
      }
    
      private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
      }
    
      private peek(): Token {
        return this.tokens[this.current];
      }
    
      private peekNext(): Token {
        return this.tokens[this.current + 1];
      }
    
      private previous(): Token {
        return this.tokens[this.current - 1];
      }
    
      private synchronize() {
        this.advance();
    
        while (!this.isAtEnd()) {
          if (this.previous().type === TokenType.SEMICOLON) return;
    
          switch (this.peek().type) {
            case TokenType.CLASS:
            case TokenType.FUN:
            case TokenType.VAR:
            case TokenType.FOR:
            case TokenType.IF:
            case TokenType.WHILE:
            case TokenType.PRINT:
            case TokenType.RETURN:
              return;
          }
    
          this.advance();
        }
      }
    }
    
    export { Parser };
    
