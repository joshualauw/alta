import { createDocument } from "zod-openapi";
import * as groupPath from "@/lib/openapi/paths/groupPath";

const document = createDocument({
    openapi: "3.0.0",
    info: {
        title: "Alta API",
        version: "1.0.0"
    },
    paths: {
        "/api/group/getAll": groupPath.getAllGroupPath,
        "/api/group/getDetail/:id": groupPath.getGroupDetailPath,
        "/api/group/create": groupPath.createGroupPath,
        "/api/group/update/:id": groupPath.updateGroupPath,
        "/api/group/delete/:id": groupPath.deleteGroupPath,
        "/api/group/changeSourceGroup": groupPath.changeSourceGroupPath
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "apiKey",
                in: "header",
                name: "x-api-key",
                description: "Alta api key"
            }
        }
    }
});

export default document;
