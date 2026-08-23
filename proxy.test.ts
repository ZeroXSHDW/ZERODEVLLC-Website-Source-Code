import { NextRequest } from "next/server";
import { proxy } from "./proxy";

describe("corporate edge host enforcement", () => {
  it("redirects HTTP and www aliases to the HTTPS apex host", () => {
    const request = new NextRequest(
      "http://www.zerodevllc.eu/security?check=1",
      {
        headers: {
          host: "www.zerodevllc.eu",
          "x-forwarded-proto": "http",
        },
      },
    );

    const response = proxy(request);

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://zerodevllc.eu/security?check=1",
    );
    expect(response.headers.get("strict-transport-security")).toContain(
      "includeSubDomains; preload",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects unknown hosts and mismatched Host headers", () => {
    const unknownHostResponse = proxy(
      new NextRequest("https://unknown.example/", {
        headers: { host: "unknown.example" },
      }),
    );
    const mismatchedHostResponse = proxy(
      new NextRequest("https://zerodevllc.com/", {
        headers: { host: "attacker.example" },
      }),
    );

    expect(unknownHostResponse.status).toBe(404);
    expect(mismatchedHostResponse.status).toBe(421);
    expect(unknownHostResponse.headers.get("x-content-type-options")).toBe(
      "nosniff",
    );
    expect(mismatchedHostResponse.headers.get("cache-control")).toBe(
      "no-store",
    );
  });

  it("does not trust a client-supplied forwarded protocol on HTTPS", () => {
    const response = proxy(
      new NextRequest("https://zerodevllc.com/", {
        headers: {
          host: "zerodevllc.com",
          "x-forwarded-proto": "http",
        },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("adds a nonce-backed CSP and host release fingerprint to canonical requests", () => {
    const response = proxy(
      new NextRequest("https://zerodevllc.store/", {
        headers: { host: "zerodevllc.store" },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-security-policy")).toMatch(
      /'nonce-[A-Za-z0-9_-]+'/,
    );
    expect(response.headers.get("content-security-policy")).not.toContain(
      "'unsafe-inline'",
    );
    expect(response.headers.get("x-zerodev-security-profile")).toBe(
      "strict-2026-08",
    );
    expect(response.headers.get("x-zerodev-release")).toMatch(
      /^zerodevllc-store-v\d+$/,
    );
  });
});
