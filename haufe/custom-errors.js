import { isCelebrateError } from "celebrate";

import {
    failure,
    invalid,
    missing,
    conflict,
    notfound,
    formatError,
    unauthorized,
    precondfailed,
    tooManyRequests,
} from "../aws/api-response-lib";

import TConfig from "../../config";

import logger from "./logger";

export class CustomError extends Error {
    constructor(errorCode, message) {
        super(message);
        this.name = "CustomError";
        this.errorCode = errorCode;
    }

    formatError() {
        return formatError(TConfig.service.NAME, this.errorCode, this.message);
    }
}

export class BadRequestError extends CustomError {
    errorFct() {
        return missing(TConfig.service.NAME, this.errorCode, this.message);
    }
}

export class UnauthorizedError extends CustomError {
    errorFct() {
        return unauthorized(TConfig.service.NAME, this.errorCode, this.message);
    }
}

export class NotFoundError extends CustomError {
    errorFct() {
        return notfound(TConfig.service.NAME, this.errorCode, this.message);
    }
}

export class ConflictError extends CustomError {
    errorFct() {
        return conflict(TConfig.service.NAME, this.errorCode, this.message);
    }
}

export class PreconditionError extends CustomError {
    errorFct() {
        return precondfailed(
            TConfig.service.NAME,
            this.errorCode,
            this.message
        );
    }
}

export class InvalidError extends CustomError {
    constructor(errorCode, message, fieldErrors) {
        super(errorCode, message);
        this.fieldErrors = fieldErrors;
    }

    errorFct() {
        return invalid(
            TConfig.service.NAME,
            this.errorCode,
            this.message,
            this.fieldErrors
        );
    }

    formatError() {
        return formatError(
            TConfig.service.NAME,
            this.errorCode,
            this.message,
            this.fieldErrors
        );
    }
}

export class FailureError extends CustomError {
    errorFct() {
        return failure(TConfig.service.NAME, this.errorCode, this.message);
    }
}

export class TooManyRequestsError extends CustomError {
    errorFct() {
        return tooManyRequests(
            TConfig.service.NAME,
            this.errorCode,
            this.message
        );
    }
}

export const joiErrorToInvalidError = (errorCode, message, joiError) => {
    if (joiError.isJoi) {
        const fieldErrors = {};
        joiError.details.forEach((detail) => {
            fieldErrors[detail.path[0] || detail.context.label] =
                detail.message;
        });

        return new InvalidError(errorCode, message, fieldErrors);
    }
    return new InvalidError(errorCode, message);
};

export const globalErrorHandler = (error, req, res, next) => {
    logger.error(`Handle error in global handler ${error}`);

    if (error instanceof CustomError) {
        logger.error(`Custom error: ${error.errorCode} ${error.message}`);
        const formatted_error = error.errorFct();

        const { code, headers, body } = formatted_error;
        res.status(code).set(headers).send(body);
    } else if (isCelebrateError(error)) {
        const validations = {};
        // eslint-disable-next-line no-unused-vars
        for (const [segment, joiError] of error.details.entries()) {
            joiError.details.forEach((detail) => {
                let path = detail.path;
                if (Array.isArray(path)) {
                    path = path[0];
                }
                if (!validations[path]) {
                    validations[path] = [];
                }
                validations[path].push(detail.message);
            });
        }
        logger.error(`Celebrate error: ${JSON.stringify(validations)}`);

        const err = new InvalidError(
            TConfig.error.API_INVALID_BODY,
            "Validation failed",
            validations
        );
        const formatted_error = err.errorFct();

        const { code, headers, body } = formatted_error;
        res.status(code).set(headers).send(body);
    } else if (error.isJoi) {
        const invalid_error = joiErrorToInvalidError(
            TConfig.error.API_INVALID_BODY,
            "Validation failed",
            error
        );

        logger.error(
            `Joi error: ${invalid_error.errorCode} ${
                invalid_error.message
            } ${JSON.stringify(invalid_error.fieldErrors)}`
        );

        const formatted_error = invalid_error.errorFct();

        const { code, headers, body } = formatted_error;
        res.status(code).set(headers).send(body);
    } else if (error?.type === "entity.parse.failed") {
        logger.error(`Invalid JSON: ${error.type}`);

        // ! Invalid JSON (body) when validation is done by celebrate on endpoint
        const formatted_error = missing(
            TConfig.service.NAME,
            TConfig.error.API_BAD_REQUEST,
            "Invalid JSON"
        );

        const { code, headers, body } = formatted_error;
        res.status(code).set(headers).send(body);
    } else {
        const formatted_error = failure(
            TConfig.service.NAME,
            TConfig.error.API_INTERNAL_ERROR,
            "Internal error"
        );

        const { code, headers, body } = formatted_error;
        res.status(code).set(headers).send(body);
    }
};
