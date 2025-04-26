import { Lexer, Lml, Parser } from "./type";

export * from "./type"

export function lml(code: string) {
    try {
        let lexer = new Lexer(code);
        let tokens = lexer.tokenize();

        let parser = new Parser(tokens);
        let ast = parser.parse();

        let lml_ast = new Lml(ast)
        return lml_ast.run()
    } catch (error: any) {
        throw error;
    }
}

if (require.main == module) {
    try {
        const ast = lml(
            `
p { "hello"b-"brian" }
`
        );

        console.log(JSON.stringify(ast, null, 2));

    } catch (e) {
        console.log(e);
    }

}