import {
    ASTNode,
    AttributeListNode,
    AttributeNode,
    BlockNode,
    DocumentNode,
    ElementListNode,
    ElementNode,
    IdentifierNode,
    NumberNode,
    SpanNode,
    StringNode,
} from "./ast";

import { Token } from "../lexer/lexer";
import { TokenType } from "../lexer/token";

export class Parser {
    private tokens: Token[] = [];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens.filter(token => token.type !== TokenType.Newline);
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private is_at_end(): boolean {
        return this.peek() == undefined ||
            this.peek().type === TokenType.EOF;
    }

    private advance(): Token {
        if (!this.is_at_end()) this.current++;
        return this.previous();
    }

    private check(type: TokenType): boolean {
        return this.peek().type === type;
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

    private error(message: string): never {
        const token = this.peek();
        throw new Error(`

${token.line_str}
${Array(token.column - 1).fill("~").join("")}^

${message} at line ${token.line}, column ${token.column}
        `);
    }

    /**
     * Document          ::= (ElementList)? <EOF>
     */
    public parse(): ASTNode {
        let source = this.element_list();

        if (!this.match(TokenType.EOF)) {
            this.error("Expected 'EOF'");
        }

        return new DocumentNode(source);
    }

    // ElementList       ::= Element+
    private element_list(): ASTNode {
        const sources: ASTNode[] = [];

        while (!this.is_at_end()) {
            sources.push(this.element());
        }

        return new ElementListNode(sources);
    }


    /*
        Element           ::= string 
                            | Identifier AttributeBlock? ElementBody?
    */
    private element(): ASTNode {
        if (this.check(TokenType.String)) {
            return this.string()
        }

        const identifer = this.identifier();
        let attributes = undefined;

        if (this.check(TokenType.LeftBracket)) {
            attributes = this.attribute_block();
        }

        return new ElementNode(identifer, attributes, this.element_body())
    }

    // AttributeBlock    ::= "[" AttributeList ("]" | EOF)
    private attribute_block(): ASTNode {
        let attribute_list = undefined;

        if (!this.match(TokenType.LeftBracket)) {
            this.error("Expected a '['");
        }

        attribute_list = this.attribute_list();

        if (!this.match(TokenType.RightBracket)) {

            if (!this.check(TokenType.EOF))
                this.error("Expected a ']'");
        }

        return attribute_list;
    }

    // AttributeList     ::= Attribute ("," Attribute)*
    private attribute_list(): AttributeListNode {
        let list: ASTNode[] = [];

        do {
            let attribute = this.attribute();

            if (attribute)
                list.push(attribute);

        } while (this.match(TokenType.Comma))

        return new AttributeListNode(list);
    }

    /*
        Attribute         ::= EOF
                            | Identifier value
    */
    private attribute(): AttributeNode | undefined {
        if (this.check(TokenType.EOF)) {
            return undefined;
        }

        const identifer = this.identifier();
        let value = this.value();

        return new AttributeNode(identifer, value)
    }

    /*
        value           ::= EOF
                        | "=" Constant
    */
    private value(): ASTNode | undefined {

        if (this.check(TokenType.EOF)) {
            return undefined;
        }

        if (!this.match(TokenType.Equals)) {
            this.error("Expected a '='");
        }

        return this.constant();
    }

    /*
        ElementBody       ::= BlockBody
                            | InlineBody
    */
    private element_body() {
        let body = undefined;

        if (this.check(TokenType.LeftBrace)) {
            body = this.block();
        } else {
            body = this.inline();
        }

        return body
    }

    private parse_sequence(
        end_token: TokenType,
        closing_error_message: string
    ): ASTNode[] {
        const nodes: ASTNode[] = [];
        let prev: ASTNode | null = null;
        let skip_space = false;

        while (!this.check(end_token) && !this.is_at_end()) {
            if (this.match(TokenType.Minus)) {
                skip_space = true;
                continue;
            }

            const curr = this.element();

            if (prev && this.should_insert_space(prev, curr) && !skip_space) {
                if (prev instanceof StringNode) {
                    prev.value += " ";
                } else {
                    const spaceNode = new StringNode(" ");
                    nodes.push(spaceNode);
                    prev = spaceNode;
                }
            }

            if (prev instanceof StringNode && curr instanceof StringNode) {
                prev.value += curr.value;
            } else {
                nodes.push(curr);
                prev = curr;
            }

            skip_space = false;
        }

        if (!this.match(end_token)) {
            if (!this.check(TokenType.EOF))
                this.error(closing_error_message);
        }

        return nodes;
    }

    // BlockBody         ::= "{" ElementList? ("}" | EOF)
    private block(): ASTNode {
        if (!this.match(TokenType.LeftBrace)) {
            this.error("Expected '{' before block body");
        }

        const body = this.parse_sequence(
            TokenType.RightBrace,
            "Expected '}' after block body"
        );

        return new BlockNode(body);
    }

    private should_insert_space(left: ASTNode, right: ASTNode): boolean {
        const isLeftTextual = left instanceof StringNode || left instanceof ElementNode;
        const isRightTextual = right instanceof StringNode || right instanceof ElementNode;
        return isLeftTextual && isRightTextual;
    }

    /*
        InlineBody        ::= EOF 
                            | String
                            | "<" Element (">" | EOF)
    */
    private inline() {
        if (this.check(TokenType.EOF)) {
            return undefined;
        }

        if (this.check(TokenType.String)) {
            return this.string();
        }

        if (!this.match(TokenType.LT)) {
            this.error("Expected '<' before span body");
        }

        const body = this.parse_sequence(
            TokenType.GT,
            "Expected '>' after span body"
        );

        return new SpanNode(body)
    }

    private identifier(): IdentifierNode {
        if (!this.match(TokenType.Identifier)) {
            this.error("Expected an identifer");
        }

        const name = this.previous().value;

        return new IdentifierNode(name);
    }

    private constant(): ASTNode | undefined {
        switch (this.peek().type) {
            case TokenType.Number:
                return this.number();
            case TokenType.String:
                return this.string();
            case TokenType.EOF:
                return undefined;
        }

        this.error("Unexpected token");
    }

    private string(): StringNode {
        if (!this.match(TokenType.String)) {
            this.error("Expected a string");
        }

        return new StringNode(this.previous().value);
    }

    private number(): NumberNode {
        if (!this.match(TokenType.Number)) {
            this.error("Expected a number");
        }

        return new NumberNode(+this.previous().value);
    }
}