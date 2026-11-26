import { describe, expect, it } from "vitest";
import { buildShortLink, countBy, generateShortCode, getLinkCode, isValidSlug } from "./links";

describe("getLinkCode", () => {
  it("prefiere el alias personalizado", () => {
    expect(getLinkCode({ short_url: "abc123", custom_url: "mi-link" })).toBe("mi-link");
  });

  it("usa el código generado si no hay alias", () => {
    expect(getLinkCode({ short_url: "abc123", custom_url: null })).toBe("abc123");
  });
});

describe("buildShortLink", () => {
  it("arma el link con el dominio actual", () => {
    expect(buildShortLink({ short_url: "abc123", custom_url: null }, "https://gbbk.app")).toBe(
      "https://gbbk.app/abc123",
    );
  });

  it("no duplica la barra final del dominio", () => {
    expect(buildShortLink({ short_url: "x", custom_url: "promo" }, "https://gbbk.app/")).toBe(
      "https://gbbk.app/promo",
    );
  });
});

describe("isValidSlug", () => {
  it("acepta letras, números, guiones y guion bajo", () => {
    expect(isValidSlug("Mi_link-2026")).toBe(true);
  });

  it("rechaza caracteres que podrían alterar la consulta", () => {
    expect(isValidSlug("abc,custom_url.neq.x")).toBe(false);
    expect(isValidSlug("con espacio")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

describe("generateShortCode", () => {
  it("genera códigos válidos del largo pedido", () => {
    const code = generateShortCode(8);
    expect(code).toHaveLength(8);
    expect(isValidSlug(code)).toBe(true);
  });
});

describe("countBy", () => {
  it("cuenta y ordena de mayor a menor", () => {
    const clicks = [{ device: "mobile" }, { device: "desktop" }, { device: "mobile" }];
    expect(countBy(clicks, (c) => c.device)).toEqual([
      { name: "mobile", count: 2 },
      { name: "desktop", count: 1 },
    ]);
  });

  it("agrupa valores vacíos bajo el texto de respaldo", () => {
    const clicks = [{ city: null }, { city: "" }, { city: "Córdoba" }];
    expect(countBy(clicks, (c) => c.city, "Sin datos")).toEqual([
      { name: "Sin datos", count: 2 },
      { name: "Córdoba", count: 1 },
    ]);
  });
});
