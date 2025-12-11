import z from "zod";
import { ZodOpenApiPathItemObject } from "zod-openapi";
import {
    errorResponseSchema,
    pagingResponseSchema,
    successResponseSchema,
    validationErrorResponseSchema
} from "@/docs/schemas/apiResponseSchema";
import { apiKeyHeaderSchema } from "@/docs/schemas/headerSchema";
import { createPresetRequest, createPresetResponse } from "@/modules/preset/dtos/createPresetDto";
import { deletePresetResponse } from "@/modules/preset/dtos/deletePresetDto";
import { getAllPresetResponse } from "@/modules/preset/dtos/getAllPresetDto";
import { getPresetDetailResponse } from "@/modules/preset/dtos/getPresetDetailDto";
import { updatePresetRequest, updatePresetResponse } from "@/modules/preset/dtos/updatePresetDto";
import { pagingQuery } from "@/types/PagingQuery";

export const getAllPresetPath: ZodOpenApiPathItemObject = {
    id: "get-all-preset",
    summary: "get all preset",
    get: {
        requestParams: {
            query: pagingQuery
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(pagingResponseSchema(getAllPresetResponse))
                    }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["preset"]
    }
};

export const getPresetDetailPath: ZodOpenApiPathItemObject = {
    id: "get-preset-detail",
    summary: "get preset detail",
    get: {
        requestParams: {
            path: z.object({ id: z.string() })
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(getPresetDetailResponse)
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
        tags: ["preset"]
    }
};

export const createPresetPath: ZodOpenApiPathItemObject = {
    id: "create-preset",
    summary: "create new preset",
    post: {
        requestBody: {
            content: {
                "application/json": {
                    schema: createPresetRequest
                }
            }
        },
        responses: {
            201: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(createPresetResponse)
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
        tags: ["preset"]
    }
};

export const updatePresetPath: ZodOpenApiPathItemObject = {
    id: "update-preset",
    summary: "update preset",
    put: {
        requestParams: {
            path: z.object({ id: z.number() })
        },
        requestBody: {
            content: {
                "application/json": {
                    schema: updatePresetRequest
                }
            }
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(updatePresetResponse)
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
        tags: ["preset"]
    }
};

export const deletePresetPath: ZodOpenApiPathItemObject = {
    id: "delete-preset",
    summary: "delete preset",
    delete: {
        requestParams: {
            path: z.object({ id: z.number() })
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(deletePresetResponse)
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
        tags: ["preset"]
    }
};
