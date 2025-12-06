import { stringify } from "yaml";
import fs from "fs";
import path from "path";
import document from "@/lib/openapi";

function generateOpenApiSpec() {
    const yaml = stringify(document, { aliasDuplicateObjects: false });
    fs.writeFileSync(path.join(process.cwd(), "openapi.yml"), yaml);
    console.log("Open API spec generated");
}

generateOpenApiSpec();
