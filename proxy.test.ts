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

  it("does not reuse a release fingerprint across domain families", () => {
    const previousRelease = process.env.ZERO_DEV_RELEASE;
    process.env.ZERO_DEV_RELEASE = "zerodevllc-com-v999";

    try {
      const storeResponse = proxy(
        new NextRequest("https://zerodevllc.store/", {
          headers: { host: "zerodevllc.store" },
        }),
      );
      expect(storeResponse.headers.get("x-zerodev-release")).toMatch(
        /^zerodevllc-store-v\d+$/,
      );

      const comResponse = proxy(
        new NextRequest("https://zerodevllc.com/", {
          headers: { host: "zerodevllc.com" },
        }),
      );
      expect(comResponse.headers.get("x-zerodev-release")).toBe(
        "zerodevllc-com-v999",
      );
    } finally {
      if (previousRelease === undefined) delete process.env.ZERO_DEV_RELEASE;
      else process.env.ZERO_DEV_RELEASE = previousRelease;
    }
  });

  it("serves host-specific security metadata for each canonical domain", async () => {
    for (const hostname of [
      "zerodevllc.com",
      "zerodevllc.eu",
      "zerodevllc.store",
    ]) {
      const securityResponse = proxy(
        new NextRequest(`https://${hostname}/.well-known/security.txt`, {
          headers: { host: hostname },
        }),
      );
      const securityBody = await securityResponse.text();
      expect(securityResponse.status).toBe(200);
      expect(securityBody).toContain(
        `Canonical: https://${hostname}/.well-known/security.txt`,
      );
      expect(securityBody).toContain(`Policy: https://${hostname}/SECURITY.md`);

      const robotsResponse = proxy(
        new NextRequest(`https://${hostname}/robots.txt`, {
          headers: { host: hostname },
        }),
      );
      const robotsBody = await robotsResponse.text();
      expect(robotsBody).toContain(`Sitemap: https://${hostname}/sitemap.xml`);
      if (hostname === "zerodevllc.store") {
        expect(robotsBody).toContain("Disallow: /success");
      } else {
        expect(robotsBody).not.toContain("Disallow: /success");
      }
    }
  });
});
