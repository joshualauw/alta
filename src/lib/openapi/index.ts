import { createDocument } from "zod-openapi";
import * as groupPath from "@/lib/openapi/paths/groupPath";
import * as presetPath from "@/lib/openapi/paths/presetPath";
import * as sourcePath from "@/lib/openapi/paths/sourcePath";

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
        "/api/group/changeSourceGroup": groupPath.changeSourceGroupPath,

        "/api/preset/getAll": presetPath.getAllPresetPath,
        "/api/preset/getDetail/:id": presetPath.getPresetDetailPath,
        "/api/preset/create": presetPath.createPresetPath,
        "/api/preset/update/:id": presetPath.updatePresetPath,
        "/api/preset/delete/:id": presetPath.deletePresetPath,

        "/api/source/getAll": sourcePath.getAllSourcePath,
        "/api/source/getDetail/:id": sourcePath.getSourceDetailPath,
        "/api/source/create": sourcePath.createSourcePath,
        "/api/source/create/bulk": sourcePath.createBulkSourcePath,
        "/api/source/search": sourcePath.searchSourcePath,
        "/api/source/update/:id": sourcePath.updateSourcePath,
        "/api/source/delete/:id": sourcePath.deleteSourcePath
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
