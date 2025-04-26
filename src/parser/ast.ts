export interface ASTVisitor {
    before_accept?(node: ASTNode, args?: Record<string, any>): any;
    after_accept?(node: ASTNode, args?: Record<string, any>): any;
    visitNumber?(node: NumberNode, args?: Record<string, any>): any;
    visitString?(node: StringNode, args?: Record<string, any>): any;
    visitDocument?(node: DocumentNode, args?: Record<string, any>): any;
    visitBlock?(node: BlockNode, args?: Record<string, any>): any;
    visitSpan?(node: SpanNode, args?: Record<string, any>): any;
    visitElement?(node: ElementNode, args?: Record<string, any>): any;
    visitAttributeList?(node: AttributeListNode, args?: Record<string, any>): any;
    visitAttribute?(node: AttributeNode, args?: Record<string, any>): any;
    visitIdentifier?(node: IdentifierNode, args?: Record<string, any>): any;
    visitElementList?(node: ElementListNode, args?: Record<string, any>): any;
}


export interface ASTNode {
    type: string;
    accept(visitor: ASTVisitor, args?: Record<string, any>): any;
}

export abstract class ASTNodeBase implements ASTNode {
    abstract type: string;

    accept(visitor: ASTVisitor, args?: Record<string, any>) {
        visitor.before_accept?.(this, args);
        const res = this._accept(visitor, args);
        visitor.after_accept?.(this, args);

        return res;
    }

    abstract _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}

export class DocumentNode extends ASTNodeBase {
    type = 'DocumentNode';

    constructor(public document: ASTNode) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitDocument?.(this, args);
    }
}

export class ElementListNode extends ASTNodeBase {
    type = 'ElementList';

    constructor(public sources: ASTNode[]) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitElementList?.(this, args);
    }
}

export class BlockNode extends ASTNodeBase {
    type = 'Block';

    constructor(public body: ASTNode[]) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitBlock?.(this, args);
    }
}

export class SpanNode extends ASTNodeBase {
    type = 'Span';

    constructor(public inline: ASTNode[]) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitSpan?.(this, args);
    }
}

export class ElementNode extends ASTNodeBase {
    type = 'Element';

    constructor(
        public identifier: ASTNode,
        public no_space: boolean = false,
        public attributes?: ASTNode,
        public body?: ASTNode
    ) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitElement?.(this, args);
    }
}

export class AttributeListNode extends ASTNodeBase {
    type = 'AttributeList';

    constructor(public attributes: any[]) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitAttributeList?.(this, args);
    }
}

export class AttributeNode extends ASTNodeBase {
    type = 'Attribute';

    constructor(
        public key: IdentifierNode,
        public value?: ASTNode
    ) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitAttribute?.(this, args);
    }
}

export class IdentifierNode extends ASTNodeBase {
    type = 'Identifier';

    constructor(public name: string) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitIdentifier?.(this, args);
    }
}

export class NumberNode extends ASTNodeBase {
    type = 'Number';

    constructor(public value: number) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitNumber?.(this, args);
    }
}

export class StringNode extends ASTNodeBase {
    type = 'String';

    constructor(public value: string) {
        super();
    }

    _accept(visitor: ASTVisitor, args?: Record<string, any>): void {
        return visitor.visitString?.(this, args);
    }
}
