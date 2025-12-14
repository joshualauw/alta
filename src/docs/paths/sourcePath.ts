import z from "zod";
import { ZodOpenApiPathItemObject } from "zod-openapi";
import {
    errorResponseSchema,
    pagingResponseSchema,
    successResponseSchema,
    validationErrorResponseSchema
} from "@/docs/schemas/apiResponseSchema";
import { apiKeyHeaderSchema } from "@/docs/schemas/headerSchema";
import { createBulkSourceQuery, createBulkSourceRequest, createBulkSourceResponse } from "@/modules/source/dtos/createBulkSourceDto";
import { createSourceQuery, createSourceRequest, createSourceResponse } from "@/modules/source/dtos/createSourceDto";
import { deleteSourceResponse } from "@/modules/source/dtos/deleteSourceDto";
import { filterSourceRequest, filterSourceResponse } from "@/modules/source/dtos/filterSourceDto";
import { getAllSourceQuery, getAllSourceResponse } from "@/modules/source/dtos/getAllSourceDto";
import { getSourceDetailResponse } from "@/modules/source/dtos/getSourceDetailDto";
import { searchSourceQuery, searchSourceRequest, searchSourceResponse } from "@/modules/source/dtos/searchSourceDto";
import { updateSourceRequest, updateSourceResponse } from "@/modules/source/dtos/updateSourceDto";
import { getSourcePresignedUrlResponse } from "@/modules/source/dtos/getSourcePresignedUrlDto";
import { uploadSourceRequest } from "@/modules/source/dtos/uploadSourceDto";

export const getAllSourcePath: ZodOpenApiPathItemObject = {
    id: "get-all-source",
    summary: "get all source",
    get: {
        requestParams: {
            query: getAllSourceQuery
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(pagingResponseSchema(getAllSourceResponse))
                    }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["source"]
    }
};

export const getSourceDetailPath: ZodOpenApiPathItemObject = {
    id: "get-source-detail",
    summary: "get source detail",
    get: {
        requestParams: {
            path: z.object({ id: z.number() })
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(getSourceDetailResponse)
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
        tags: ["source"]
    }
};

export const createSourcePath: ZodOpenApiPathItemObject = {
    id: "create-source",
    summary: "create new source",
    post: {
        requestParams: {
            query: createSourceQuery
        },
        requestBody: {
            content: {
                "application/json": {
                    schema: createSourceRequest
                }
            }
        },
        responses: {
            201: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(createSourceResponse)
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
        tags: ["source"]
    }
};

export const getSourcePresignedUrlPath: ZodOpenApiPathItemObject = {
    id: "get-source-presigned-url",
    summary: "get presigned url from S3 to upload file",
    get: {
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(getSourcePresignedUrlResponse)
                    }
                }
            }
        },
        tags: ["source"]
    }
};

export const uploadSourcePath: ZodOpenApiPathItemObject = {
    id: "upload-source",
    summary: "upload source by referencing object key",
    post: {
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(uploadSourceRequest)
                    }
                }
            },
            404: {
                description: "file not found",
                content: {
                    "application/json": {
                        schema: errorResponseSchema
                    }
                }
            },
            400: {
                description: "error",
                content: {
                    "application/json": {
                        schema: validationErrorResponseSchema
                    }
                }
            }
        },
        tags: ["source"]
    }
};

export const filterSourcePath: ZodOpenApiPathItemObject = {
    id: "filter-source",
    summary: "filter source by metadata",
    post: {
        requestBody: {
            content: {
                "application/json": {
                    schema: filterSourceRequest
                }
            }
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(filterSourceResponse)
                    }
                }
            },
            400: {
                description: "error",
                content: {
                    "application/json": {
                        schema: validationErrorResponseSchema
                    }
                }
            }
        },
        tags: ["source"]
    }
};

export const createBulkSourcePath: ZodOpenApiPathItemObject = {
    id: "create-bulk-source",
    summary: "create sources (bulk) in background",
    post: {
        requestParams: {
            query: createBulkSourceQuery
        },
        requestBody: {
            content: {
                "application/json": {
                    schema: createBulkSourceRequest
                }
            }
        },
        responses: {
            201: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(createBulkSourceResponse)
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
        tags: ["source"]
    }
};

export const searchSourcePath: ZodOpenApiPathItemObject = {
    id: "search-source",
    summary: "search source",
    post: {
        requestParams: {
            query: searchSourceQuery
        },
        requestBody: {
            content: {
                "application/json": {
                    schema: searchSourceRequest
                }
            }
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(searchSourceResponse)
                    }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["source"]
    }
};

export const updateSourcePath: ZodOpenApiPathItemObject = {
    id: "update-source",
    summary: "update source",
    put: {
        requestParams: {
            path: z.object({ id: z.number() })
        },
        requestBody: {
            content: {
                "application/json": {
                    schema: updateSourceRequest
                }
            }
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(updateSourceResponse)
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
        tags: ["source"]
    }
};

export const deleteSourcePath: ZodOpenApiPathItemObject = {
    id: "delete-source",
    summary: "delete source",
    delete: {
        requestParams: {
            path: z.object({ id: z.number() })
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(deleteSourceResponse)
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
        tags: ["source"]
    }
};
