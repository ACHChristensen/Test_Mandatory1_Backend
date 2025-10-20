import * as fakeInfoModule from "./fakeInfo";

// brug den "rigtige" implementation i happy/property tests
const realGetFakeInfo = fakeInfoModule.default;

describe("WHITE-BOX: getFakeInfo intern logik (uden HTTP)", () => {
  test("[WB][Happy] getFakeInfo_Returns_Schema_Compliant_Object", async () => {
    const p = await realGetFakeInfo();

    expect(p).toEqual(
      expect.objectContaining({
        firstName: expect.any(String),
        lastName: expect.any(String),
        gender: expect.stringMatching(/^(male|female)$/),
        birthDate: expect.any(String),
        CPR: expect.stringMatching(/^\d{6}-\d{4}$/),
        phoneNumber: expect.stringMatching(/^\d{8}$/),
        address: expect.objectContaining({
          street: expect.any(String),
          number: expect.anything(),
          town_name: expect.any(String),
          postal_code: expect.stringMatching(/^\d{4}$/),
        }),
      })
    );

    // Konsistens: CPR-prefix (DDMMYY) matcher birthDate (håndterer både YYYY-MM-DD og DD-MM-YYYY)
    const dob = String(p.birthDate).trim();
    const ddmmyy =
      /^\d{4}-\d{2}-\d{2}$/.test(dob)
        ? (() => { const [y,m,d] = dob.split("-"); return `${d}${m}${y.slice(-2)}`; })()
        : (() => { const [d,m,y] = dob.split("-"); return `${d}${m}${y.slice(-2)}`; })();
    expect(p.CPR.startsWith(ddmmyy)).toBe(true);
  });

  // Kør property-testen før den negative test
  test("[WB][Property] getFakeInfo_Phone_And_CPR_Format_Over_Multiple_Runs", async () => {
    for (let i = 0; i < 5; i++) {
      const p = await realGetFakeInfo();
      expect(p).toBeDefined();
      expect(p.phoneNumber).toMatch(/^\d{8}$/);
      expect(p.CPR).toMatch(/^\d{6}-\d{4}$/);
      expect(p.address.postal_code).toMatch(/^\d{4}$/);
      expect(typeof p.address.town_name).toBe("string");
    }
  });

  test("[WB][Property] getFakeInfo_Phone_And_CPR_Format_Over_Multiple_Runs", async () => {
  for (let i = 0; i < 5; i++) {
    // Re-import for hver iteration for at undgå stale/mocket modul
    const { default: freshGetFakeInfo } = await import("./fakeInfo");
    const p = await freshGetFakeInfo();

    // Defensive guards + klare fejlbeskeder
    if (!p || typeof p !== "object") {
      throw new Error(`Iteration ${i}: Invalid person payload: ${JSON.stringify(p)}`);
    }
    if (!p.address || typeof p.address !== "object") {
      throw new Error(`Iteration ${i}: Missing/invalid address: ${JSON.stringify(p)}`);
    }

    // Format-asserts
    expect(String(p.phoneNumber)).toMatch(/^\d{8}$/);
    expect(String(p.CPR)).toMatch(/^\d{6}-\d{4}$/);
    expect(String(p.address.postal_code)).toMatch(/^\d{4}$/);
    expect(typeof p.address.town_name).toBe("string");
  }
});

});