export function accepted(body) {
    return buildResponse(202, body);
}

export function acceptedExpress(body, res, next) {
    res.api_response = accepted(body);
    next();
}

export function success(body) {
    return buildResponse(200, body);
}

export function successExpress(body, res, next) {
    res.api_response = success(body);
    next();
}

export function created(body) {
    return buildResponse(201, body);
}

export function createdExpress(body, res, next) {
    res.api_response = created(body);
    next();
}

export function nocontent() {
    return buildResponse(204, null);
}

export function noContentExpress(res, next) {
    res.api_response = nocontent();
    next();
}

export function failure(errorType, errorCode, errorMsg) {
    return buildError(500, errorType, errorCode, errorMsg);
}

export function missing(errorType, errorCode, errorMsg) {
    return buildError(400, errorType, errorCode, errorMsg);
}

export function unauthorized(errorType, errorCode, errorMsg) {
    return buildError(401, errorType, errorCode, errorMsg);
}

export function notfound(errorType, errorCode, errorMsg) {
    return buildError(404, errorType, errorCode, errorMsg);
}

export function conflict(errorType, errorCode, errorMsg) {
    return buildError(409, errorType, errorCode, errorMsg);
}

export function precondfailed(errorType, errorCode, errorMsg) {
    return buildError(412, errorType, errorCode, errorMsg);
}

export function invalid(errorType, errorCode, errorMsg, errorFields) {
    return buildError(422, errorType, errorCode, errorMsg, errorFields);
}

export function tooManyRequests(errorType, errorCode, errorMsg, errorFields) {
    return buildError(429, errorType, errorCode, errorMsg, errorFields);
}

export function formatError(errorType, errorCode, errorMsg, errorFields) {
    const body = {
        error: {
            type: errorType || "base",
            code: errorCode || "001",
            msg: errorMsg || "Internal Error",
        },
    };
    // detailed error messages for particular fields in the request body
    if (errorFields) {
        body.error.fields = errorFields;
    }
    return body;
}

function buildError(statusCode, errorType, errorCode, errorMsg, errorFields) {
    const body = formatError(errorType, errorCode, errorMsg, errorFields);
    return buildResponse(statusCode, body);
}

function buildResponse(statusCode, body) {
    return {
        code: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
    };
}
