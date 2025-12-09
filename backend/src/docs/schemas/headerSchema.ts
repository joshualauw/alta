import z from "zod";

export const apiKeyHeaderSchema = z.object({
    "x-api-key": z.string()
});
