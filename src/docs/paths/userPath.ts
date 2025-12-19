import { errorResponseSchema, successResponseSchema } from "@/docs/schemas/apiResponseSchema";
import { loginRequest, loginResponse } from "@/modules/user/dtos/loginDto";
import { ZodOpenApiPathItemObject } from "zod-openapi";

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
