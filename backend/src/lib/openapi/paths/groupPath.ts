import { apiKeyHeaderSchema } from "@/lib/openapi/schemas/headerSchema";
import { getAllGroupResponse } from "@/modules/group/dtos/getAllGroupDto";
import { getGroupDetailResponse } from "@/modules/group/dtos/getGroupDetailDto";
import { ZodOpenApiPathItemObject } from "zod-openapi";
import {
    successResponseSchema,
    errorResponseSchema,
    validationErrorResponseSchema
} from "@/lib/openapi/schemas/apiResponseSchema";
import z from "zod";
import { createGroupRequest, createGroupResponse } from "@/modules/group/dtos/createGroupDto";
import { updateGroupRequest, updateGroupResponse } from "@/modules/group/dtos/updateGroupDto";
import { deleteGroupResponse } from "@/modules/group/dtos/deleteGroupDto";
import { changeSourceGroupRequest, changeSourceGroupResponse } from "@/modules/group/dtos/changeSourceGroupDto";

export const getAllGroupPath: ZodOpenApiPathItemObject = {
    id: "get-all-group",
    summary: "get all group",
    get: {
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(z.array(getAllGroupResponse))
                    }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["group"]
    }
};

export const getGroupDetailPath: ZodOpenApiPathItemObject = {
    id: "get-group-detail",
    summary: "get group detail",
    get: {
        requestParams: {
            path: z.object({ id: z.number() })
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(getGroupDetailResponse)
                    }
                },
                headers: apiKeyHeaderSchema
            },
            404: {
                description: "not found",
                content: {
                    "application/json": { schema: errorResponseSchema }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["group"]
    }
};

export const createGroupPath: ZodOpenApiPathItemObject = {
    id: "create-group",
    summary: "create new group",
    post: {
        requestBody: {
            content: {
                "application/json": { schema: createGroupRequest }
            }
        },
        responses: {
            201: {
                description: "success",
                content: {
                    "application/json": { schema: successResponseSchema(createGroupResponse) }
                },
                headers: apiKeyHeaderSchema
            },
            400: {
                description: "validation failed",
                content: {
                    "application/json": { schema: validationErrorResponseSchema }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["group"]
    }
};

export const updateGroupPath: ZodOpenApiPathItemObject = {
    id: "update-group",
    summary: "update group",
    put: {
        requestParams: {
            path: z.object({ id: z.number() })
        },
        requestBody: {
            content: {
                "application/json": { schema: updateGroupRequest }
            }
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": { schema: successResponseSchema(updateGroupResponse) }
                },
                headers: apiKeyHeaderSchema
            },
            400: {
                description: "validation failed",
                content: {
                    "application/json": { schema: validationErrorResponseSchema }
                },
                headers: apiKeyHeaderSchema
            },
            404: {
                description: "not found",
                content: {
                    "application/json": { schema: errorResponseSchema }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["group"]
    }
};

export const deleteGroupPath: ZodOpenApiPathItemObject = {
    id: "delete-group",
    summary: "delete group",
    delete: {
        requestParams: {
            path: z.object({ id: z.number() })
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(deleteGroupResponse)
                    }
                },
                headers: apiKeyHeaderSchema
            },
            404: {
                description: "not found",
                content: {
                    "application/json": { schema: errorResponseSchema }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["group"]
    }
};

export const changeSourceGroupPath: ZodOpenApiPathItemObject = {
    id: "change-source-group",
    summary: "change source group",
    patch: {
        requestBody: {
            content: {
                "application/json": { schema: changeSourceGroupRequest }
            }
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": { schema: successResponseSchema(changeSourceGroupResponse) }
                },
                headers: apiKeyHeaderSchema
            },
            400: {
                description: "validation failed",
                content: {
                    "application/json": { schema: validationErrorResponseSchema }
                },
                headers: apiKeyHeaderSchema
            },
            404: {
                description: "not found",
                content: {
                    "application/json": { schema: errorResponseSchema }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["group"]
    }
};
