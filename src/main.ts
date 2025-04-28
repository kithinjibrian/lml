import { Lexer, Lml, Parser } from "./type";

export * from "./type"

export async function lml(code: string) {
    try {
        let lexer = new Lexer(code);
        let tokens = lexer.tokenize();

        let parser = new Parser(tokens);
        let ast = parser.parse();

        let lml_ast = new Lml(ast)
        return await lml_ast.run()
    } catch (error: any) {
        throw error;
    }
}

if (require.main == module) {
    try {
        lml(
            `
p { "men"span<"women""children"> }
`
        )
            .then((ast) => {
                console.log(JSON.stringify(ast, null, 2));
            });


    } catch (e) {
        console.log(e);
    }

}