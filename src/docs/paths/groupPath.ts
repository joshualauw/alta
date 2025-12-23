import z from "zod";
import { ZodOpenApiPathItemObject } from "zod-openapi";
import {
    errorResponseSchema,
    pagingResponseSchema,
    successResponseSchema,
    validationErrorResponseSchema
} from "@/docs/schemas/apiResponseSchema";
import { apiKeyHeaderSchema } from "@/docs/schemas/headerSchema";
import { createGroupRequest, createGroupResponse } from "@/modules/group/dtos/createGroupDto";
import { deleteGroupResponse } from "@/modules/group/dtos/deleteGroupDto";
import { getAllGroupResponse } from "@/modules/group/dtos/getAllGroupDto";
import { getGroupDetailResponse } from "@/modules/group/dtos/getGroupDetailDto";
import { updateGroupRequest, updateGroupResponse } from "@/modules/group/dtos/updateGroupDto";
import { pagingQuery } from "@/types/PagingQuery";

export const getAllGroupPath: ZodOpenApiPathItemObject = {
    id: "get-all-group",
    summary: "get all group",
    get: {
        requestParams: {
            query: pagingQuery
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(pagingResponseSchema(getAllGroupResponse))
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
                    "application/json": {
                        schema: errorResponseSchema
                    }
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
                "application/json": {
                    schema: createGroupRequest
                }
            }
        },
        responses: {
            201: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(createGroupResponse)
                    }
                },
                headers: apiKeyHeaderSchema
            },
            400: {
                description: "validation failed",
                content: {
                    "application/json": {
                        schema: validationErrorResponseSchema
                    }
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
                "application/json": {
                    schema: updateGroupRequest
                }
            }
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(updateGroupResponse)
                    }
                },
                headers: apiKeyHeaderSchema
            },
            400: {
                description: "validation failed",
                content: {
                    "application/json": {
                        schema: validationErrorResponseSchema
                    }
                },
                headers: apiKeyHeaderSchema
            },
            404: {
                description: "not found",
                content: {
                    "application/json": {
                        schema: errorResponseSchema
                    }
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
                    "application/json": {
                        schema: errorResponseSchema
                    }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["group"]
    }
};
