import { StatusCodes } from "http-status-codes";

export class ServiceError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "ServiceError";
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}

export class InternalServerError extends ServiceError {
    constructor(message: string) {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export class UnauthorizedError extends ServiceError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export class NotFoundError extends ServiceError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

export class NotImplementedError extends ServiceError {
    constructor() {
        super("Not implemented yet", StatusCodes.NOT_IMPLEMENTED);
    }
}

export class UnprocessableEntityError extends ServiceError {
    constructor(message: string) {
        super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

export class BadRequestError extends ServiceError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

export class ForbiddenError extends ServiceError {
    constructor(message: string) {
        super(message, StatusCodes.FORBIDDEN);
    }
}
