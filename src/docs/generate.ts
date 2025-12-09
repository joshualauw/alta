import { stringify } from "yaml";
import fs from "fs";
import path from "path";
import logger from "@/lib/pino";
import document from "@/docs";

function generateOpenApiSpec() {
    const yaml = stringify(document, { aliasDuplicateObjects: false });
    fs.writeFileSync(path.join(process.cwd(), "openapi.yml"), yaml);
    logger.info("Open API spec generated");
}

generateOpenApiSpec();
