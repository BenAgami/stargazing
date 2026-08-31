import { StatusCodes } from "http-status-codes";
import { z, type ZodType } from "zod";
import type { Request } from "express";

import validateSchema from "../../../src/middlewares/validateSchema";
import { getZodErrorMessage } from "../../../src/utils/zodErrorMessage";

import {
  createMockNext,
  createMockRequest,
  createMockResponse,
  jsonBody,
} from "../helpers/expressMocks";

const run = (schema: ZodType, req: Partial<Request>) => {
  const res = createMockResponse();
  const next = createMockNext();

  validateSchema(schema)(createMockRequest(req), res, next);

  return { res, next };
};

const bodySchema = z.object({ body: z.object({ email: z.email() }) });

describe("validateSchema", () => {
  it("calls next with no arguments when the request is valid", () => {
    const { res, next } = run(bodySchema, {
      body: { email: "user@example.com" },
    });

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("validates body, query and params together", () => {
    const schema = z.object({
      body: z.object({ name: z.string() }),
      query: z.object({ limit: z.string() }),
      params: z.object({ id: z.string() }),
    });

    const valid = run(schema, {
      body: { name: "push day" },
      query: { limit: "10" },
      params: { id: "7" },
    });
    expect(valid.next).toHaveBeenCalledWith();

    // Dropping any one of the three sources must fail validation.
    const missingParams = run(schema, {
      body: { name: "push day" },
      query: { limit: "10" },
      params: {},
    });
    expect(missingParams.next).not.toHaveBeenCalled();
    expect(missingParams.res.status).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
    );
  });

  it("responds 400 with details built by getZodErrorMessage", () => {
    const { res, next } = run(bodySchema, { body: { email: "nope" } });

    const expected = getZodErrorMessage(
      bodySchema.safeParse({ body: { email: "nope" }, query: {}, params: {} })
        .error!,
    );

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(jsonBody(res)).toEqual({
      success: false,
      message: "Validation Error",
      details: expected,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards a non-ZodError to next and leaves the response untouched", () => {
    const boom = new Error("schema exploded");
    const throwingSchema = z.custom(() => {
      throw boom;
    });

    const { res, next } = run(throwingSchema, { body: {} });

    expect(next).toHaveBeenCalledWith(boom);
    expect(res.status).not.toHaveBeenCalled();
  });
});
