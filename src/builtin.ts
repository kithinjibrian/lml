import { builtin } from "@kithinji/tlugha-core";

builtin["__hook__"] = {
    type: "function",
    signature: "",
    has_callback: true,
    exec: (args: any[]) => {
        let ast = null;

        if (
            "__ast__" in builtin &&
            builtin.__ast__.type == "function"
        ) {
            ast = builtin.__ast__.exec([]);
        }

        console.log(ast);

        return null;
    }
}

export { builtin };