import { afterEach, describe, expect, it } from "vitest";
import { isMongoConfigured } from "@/lib/mongodb";

describe("MongoDB configuration", () => {
  const original = process.env.MONGODB_URI;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = original;
    }
  });

  it("does not treat Mongo as configured without MONGODB_URI", () => {
    delete process.env.MONGODB_URI;
    expect(isMongoConfigured()).toBe(false);
  });

  it("treats Mongo as configured when MONGODB_URI is present", () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
    expect(isMongoConfigured()).toBe(true);
  });
});
