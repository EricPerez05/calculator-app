import { calculate } from "./calculator.mjs";

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
    },
    body: JSON.stringify(body),
  };
}

function parseExpression(event) {
  if (!event?.body) {
    throw new Error("Request body is required.");
  }

  const parsedBody = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { expression } = parsedBody ?? {};

  if (typeof expression !== "string") {
    throw new Error("expression must be a string.");
  }

  return expression;
}

export const handler = async (event) => {
  if (event?.requestContext?.http?.method === "OPTIONS" || event?.httpMethod === "OPTIONS") {
    return response(200, { ok: true });
  }

  try {
    const expression = parseExpression(event);
    const result = calculate(expression);
    return response(200, { result });
  } catch (error) {
    return response(400, {
      error: error instanceof Error ? error.message : "Invalid request.",
    });
  }
};
