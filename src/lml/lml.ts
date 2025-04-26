import {
    ASTNode,
    ASTVisitor,
    AttributeListNode,
    BlockNode,
    DocumentNode,
    ElementListNode,
    ElementNode,
    Extension,
    IdentifierNode,
    NumberNode,
    SpanNode,
    StringNode
} from "../type";

import {
    BNode,
    ButtonNode,
    CNode,
    CodeNode,
    FormNode,
    H1Node,
    H2Node,
    H3Node,
    H4Node,
    H5Node,
    H6Node,
    ImageNode,
    INode,
    InputNode,
    LinkNode,
    LiNode,
    LmlSpanNode,
    NoSpaceNode,
    OlNode,
    ParagraphNode,
    SinkholeNode,
    UlNode
} from "./ast";

export class Lml implements ASTVisitor {
    private extensions: Extension<any>[] = [];

    constructor(
        public ast: ASTNode,
    ) { }

    public extension(p: Extension<any>) {
        this.extensions.push(p);
        return this;
    }

    public before_accept(
        node: ASTNode,
        args?: Record<string, any>
    ) {
        // console.log(node.type)
        this.extensions.forEach(extension => extension.beforeAccept?.(node, this, args));
    }

    public visit(node?: ASTNode, args?: Record<string, any>): ASTNode | undefined {
        if (node == undefined) return undefined;

        return node.accept(this, args);
    }

    public after_accept(
        node: ASTNode,
        args?: Record<string, any>
    ) {
        this.extensions.forEach(extension => extension.afterAccept?.(node, this, args));
    }

    run() {
        return this.visit(this.ast);
    }

    visitDocument(
        node: DocumentNode,
    ) {
        let doc = this.visit(node.document);
        if (doc)
            return new DocumentNode(doc);
    }

    visitElementList(node: ElementListNode) {
        let list = node.sources
            .map(src => this.visit(src))
            .filter(src => src !== undefined);

        return new ElementListNode(list);
    }

    visitElement(node: ElementNode) {
        let identifier = this.visit(node.identifier);
        let name = (identifier as IdentifierNode).name;

        let attributes = this.visit(node.attributes);
        let body = this.visit(node.body)

        let no_space = node.no_space;

        switch (name) {
            case "p":
                return new ParagraphNode(attributes, body);
            case "h1":
                return new H1Node(attributes, body);
            case "h2":
                return new H2Node(attributes, body);
            case "h3":
                return new H3Node(attributes, body);
            case "h4":
                return new H4Node(attributes, body);
            case "h5":
                return new H5Node(attributes, body);
            case "h6":
                return new H6Node(attributes, body);
            case "c":
                return new CNode(no_space, attributes, body);
            case "b":
                return new BNode(no_space, attributes, body);
            case "i":
                return new INode(no_space, attributes, body);
            case "ol":
                return new OlNode(attributes, body);
            case "ul":
                return new UlNode(attributes, body);
            case "li":
                return new LiNode(attributes, body);
            case "span":
                return new LmlSpanNode(attributes, body);
            case "button":
                return new ButtonNode(attributes, body);
            case "input":
                return new InputNode(attributes, body);
            case "form":
                return new FormNode(attributes, body);
            case "img":
                return new ImageNode(attributes, body);
            case "link":
                return new LinkNode(attributes, body);
            case "code":
                return new CodeNode(attributes, body);
            case "ns":
                return new NoSpaceNode(attributes, body);
        }

        return new SinkholeNode(
            (node.identifier as IdentifierNode).name,
            attributes,
            body
        );
    }

    visitAttributeList(node: AttributeListNode) {
        return node;
    }

    visitBlock(node: BlockNode) {
        let block = node.body
            .map(src => this.visit(src))
            .filter(src => src !== undefined);

        return new BlockNode(block);
    }

    visitSpan(node: SpanNode) {
        return node;
    }

    visitIdentifier(node: IdentifierNode) {
        return node;
    }

    visitString(node: StringNode) {
        return node;
    }

    visitNumber(node: NumberNode) {
        return node;
    }
}