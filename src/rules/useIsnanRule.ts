import * as ts from "tslint/node_modules/typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Use the isNaN function to compare with NaN: ';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const walker = new UseIsnanWalker(sourceFile, this.getOptions());
    return this.applyWithWalker(walker);
  }
}

class UseIsnanWalker extends Lint.RuleWalker {
  private OPERATORS = [ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken];
  
  protected visitBinaryExpression(node: ts.BinaryExpression) {
    this.validateUseIsnan(node);    
    super.visitBinaryExpression(node);
  }
  
  private validateUseIsnan(node: ts.BinaryExpression) {
    if (this.OPERATORS.indexOf(node.operatorToken.kind) !== -1 && (node.left.getText() === 'NaN' || node.right.getText() === 'NaN')) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }
  }
}
