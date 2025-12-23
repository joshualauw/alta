import { errorResponseSchema, successResponseSchema } from "@/docs/schemas/apiResponseSchema";
import { loginRequest, loginResponse } from "@/modules/user/dtos/loginDto";
import { meResponse } from "@/modules/user/dtos/meDto";
import { ZodOpenApiPathItemObject } from "zod-openapi";

export const mePath: ZodOpenApiPathItemObject = {
    id: "me",
    summary: "get current logged in user",
    get: {
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(meResponse)
                    }
                }
            }
        },
        tags: ["user"]
    }
};

export const loginPath: ZodOpenApiPathItemObject = {
    id: "login",
    summary: "login",
    post: {
        requestBody: {
            content: {
                "application/json": {
                    schema: loginRequest
                }
            }
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(loginResponse)
                    }
                }
            },
            401: {
                description: "invalid credentials",
                content: {
                    "application/json": {
                        schema: errorResponseSchema
                    }
                }
            }
        },
        tags: ["user"]
    }
};
