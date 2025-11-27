import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@/types/ApiResponse";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);

      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Validation failed",
        errors,
      };

      return res.status(400).send(response);
    }

    req.body = result.data;

    next();
  };
