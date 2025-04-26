import { ASTNode, ASTVisitor } from "../type";

export interface LmlASTVisitor extends ASTVisitor {
    visitParagraph?(node: ParagraphNode, args?: Record<string, any>): any;
    visitColumn?(node: ColumnNode, args?: Record<string, any>): any;
    visitRow?(node: RowNode, args?: Record<string, any>): any;
    visitCode?(node: CodeNode, args?: Record<string, any>): any;
    visitH1?(node: H1Node, args?: Record<string, any>): any;
    visitH2?(node: H2Node, args?: Record<string, any>): any;
    visitH3?(node: H3Node, args?: Record<string, any>): any;
    visitH4?(node: H4Node, args?: Record<string, any>): any;
    visitH5?(node: H5Node, args?: Record<string, any>): any;
    visitH6?(node: H6Node, args?: Record<string, any>): any;
    visitC?(node: CNode, args?: Record<string, any>): any;
    visitB?(node: BNode, args?: Record<string, any>): any;
    visitI?(node: INode, args?: Record<string, any>): any;
    visitOl?(node: OlNode, args?: Record<string, any>): any;
    visitUl?(node: UlNode, args?: Record<string, any>): any;
    visitLi?(node: LiNode, args?: Record<string, any>): any;
    visitNoSpace?(node: NoSpaceNode, args?: Record<string, any>): any;
    visitSpan?(node: LmlSpanNode, args?: Record<string, any>): any;
    visitButton?(node: ButtonNode, args?: Record<string, any>): any;
    visitInput?(node: InputNode, args?: Record<string, any>): any;
    visitForm?(node: FormNode, args?: Record<string, any>): any;
    visitImg?(node: ImageNode, args?: Record<string, any>): any;
    visitLink?(node: LinkNode, args?: Record<string, any>): any;
    visitSinkhole?(node: SinkholeNode, args?: Record<string, any>): any;
}

export abstract class LmlASTNodeBase implements ASTNode {
    abstract type: string;
    attributes?: ASTNode;
    body?: ASTNode;

    constructor(attributes?: ASTNode, body?: ASTNode) {
        this.attributes = attributes;
        this.body = body;
    }

    accept(visitor: LmlASTVisitor, args?: Record<string, any>) {
        visitor.before_accept?.(this, args);
        const res = this._accept(visitor, args);
        visitor.after_accept?.(this, args);

        return res;
    }

    abstract _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void;
}

export class ColumnNode extends LmlASTNodeBase {
    type = 'col';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitColumn?.(this, args);
    }
}

export class RowNode extends LmlASTNodeBase {
    type = 'row';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitRow?.(this, args);
    }
}

export class ParagraphNode extends LmlASTNodeBase {
    type = 'p';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitParagraph?.(this, args);
    }
}

export class NoSpaceNode extends LmlASTNodeBase {
    type = 'ns';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitNoSpace?.(this, args);
    }
}

export class CodeNode extends LmlASTNodeBase {
    type = 'code';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitCode?.(this, args);
    }
}

export class H1Node extends LmlASTNodeBase {
    type = 'h1';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitH1?.(this, args);
    }
}

export class H2Node extends LmlASTNodeBase {
    type = 'h2';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitH2?.(this, args);
    }
}

export class H3Node extends LmlASTNodeBase {
    type = 'h3';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitH3?.(this, args);
    }
}

export class H4Node extends LmlASTNodeBase {
    type = 'h4';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitH4?.(this, args);
    }
}

export class H5Node extends LmlASTNodeBase {
    type = 'h5';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitH5?.(this, args);
    }
}

export class H6Node extends LmlASTNodeBase {
    type = 'h6';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitH6?.(this, args);
    }
}

// inline code
export class CNode extends LmlASTNodeBase {
    type = 'c';

    constructor(
        public no_space: boolean = false,
        attributes?: ASTNode,
        body?: ASTNode
    ) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitC?.(this, args);
    }
}

export class BNode extends LmlASTNodeBase {
    type = 'b';

    constructor(
        public no_space: boolean = false,
        attributes?: ASTNode,
        body?: ASTNode
    ) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitB?.(this, args);
    }
}

export class INode extends LmlASTNodeBase {
    type = 'i';

    constructor(
        public no_space: boolean = false,
        attributes?: ASTNode,
        body?: ASTNode
    ) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitI?.(this, args);
    }
}

export class OlNode extends LmlASTNodeBase {
    type = 'ol';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitOl?.(this, args);
    }
}

export class UlNode extends LmlASTNodeBase {
    type = 'ul';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitUl?.(this, args);
    }
}

export class LiNode extends LmlASTNodeBase {
    type = 'li';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitLi?.(this, args);
    }
}

export class LmlSpanNode extends LmlASTNodeBase {
    type = 'span';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitSpan?.(this, args);
    }
}

export class ButtonNode extends LmlASTNodeBase {
    type = 'button';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitButton?.(this, args);
    }
}

export class InputNode extends LmlASTNodeBase {
    type = 'input';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitInput?.(this, args);
    }
}

export class FormNode extends LmlASTNodeBase {
    type = 'form';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitForm?.(this, args);
    }
}

export class ImageNode extends LmlASTNodeBase {
    type = 'img';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitImg?.(this, args);
    }
}

export class LinkNode extends LmlASTNodeBase {
    type = 'link';

    constructor(attributes?: ASTNode, body?: ASTNode) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitLink?.(this, args);
    }
}

export class SinkholeNode extends LmlASTNodeBase {
    type = '__sinkhole__';

    constructor(
        public name: string,
        attributes?: ASTNode,
        body?: ASTNode
    ) {
        super(attributes, body);
    }

    _accept(visitor: LmlASTVisitor, args?: Record<string, any>): void {
        return visitor.visitSinkhole?.(this, args);
    }
}
