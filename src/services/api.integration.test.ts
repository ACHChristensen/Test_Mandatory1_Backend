import axios from "axios";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  validateStatus: () => true, // vi asserter selv
});

// Hjælp: lav DDMMYY fra både "YYYY-MM-DD" og "DD-MM-YYYY"
function ddMMyyFromDateString(s: string): string {
  // Trim & simple pattern detect
  const t = (s || "").trim();
  // yyyy-mm-dd ?
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const [y, m, d] = t.split("-");
    return `${d}${m}${y.slice(-2)}`;
  }
  // dd-mm-yyyy ?
  if (/^\d{2}-\d{2}-\d{4}$/.test(t)) {
    const [d, m, y] = t.split("-");
    return `${d}${m}${y.slice(-2)}`;
  }
  // fallback: prøv Date (kan være upålidelig på dd-mm-yyyy i nogle miljøer)
  const d = new Date(t);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}${mm}${yy}`;
}

describe("API via localhost", () => {
  test("[BB][Happy] GET_/person Returns_200_And_Person_Schema_Compliant", async () => {
    const res = await client.get("/person");
    if (res.status !== 200) {
      // bedre diagnostik ved fejl
      // eslint-disable-next-line no-console
      console.error("Unexpected /person:", res.status, res.headers, res.data);
    }
    expect(res.status).toBe(200);

    // API returnerer { person: {...} }
    console.log(res);
    const p = res.data[0] as any;
    expect(p).toBeDefined();

    expect(p).toEqual(
      expect.objectContaining({
        firstName: expect.any(String),
        lastName: expect.any(String),
        gender: expect.stringMatching(/^(male|female)$/),
        birthDate: expect.any(String), // fx "14-04-1969"
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

    // Konsistens: CPR-prefix (DDMMYY) matcher birthDate
    const prefix = ddMMyyFromDateString(p.birthDate);
    expect(p.CPR.startsWith(prefix)).toBe(true);
  });

  test("[BB][Happy] GET_/person Sets_GlobalHeaders_Cors_And_AcceptVersion_v1", async () => {
    const res = await client.get("/person");
    expect(res.status).toBe(200);

    // axios normaliserer header-navne til lowercase
    expect(res.headers["access-control-allow-origin"]).toBe("*");
    expect(res.headers["accept-version"]).toBe("v1");
  });

  test("[BB][Negativ] GET Unknown Route – 404 JSON or HTML error accepted", async () => {
    const res = await client.get("/does-not-exist");
    expect(res.status).toBe(404);

    const isJsonObj = typeof res.data === "object" && res.data !== null;
    if (isJsonObj) {
      expect(
        typeof (res.data as any).error === "string" ||
        typeof (res.data as any).message === "string"
      ).toBe(true);
    } else {
      expect(typeof res.data === "string").toBe(true); // HTML
      expect(res.data.length).toBeGreaterThan(0);
    }
  });

  test("[BB][Happy] GET_/ Returns_HTML_With_Links", async () => {
    const res = await client.get("/");
    expect(res.status).toBe(200);
    expect(typeof res.data).toBe("string");
    // forvent at de vigtigste links er på siden
    expect(res.data).toContain("/person");
    expect(res.data).toContain("/cpr");
    expect(res.data).toContain("/address");
  });
});

// valgfrit: dæmp Jest-warning om åbne handles i nogle miljøer
afterAll(() => {
  jest.clearAllTimers();
});

test("[BB][Happy] GET_/cpr Returns_200_And_CPR_Format", async () => {
  const res = await client.get("/cpr");
  expect(res.status).toBe(200);
  const cpr = (res.data?.CPR ?? res.data?.cpr ?? res.data) as string;
  expect(typeof cpr).toBe("string");
  expect(cpr).toMatch(/^\d{6}-\d{4}$/);
});

test("[BB][Happy] GET_/address Returns_200_And_Address_Schema", async () => {
  const res = await client.get("/address");
  expect(res.status).toBe(200);
  const a = res.data?.address ?? res.data;
  expect(a).toEqual(
    expect.objectContaining({
      street: expect.any(String),
      number: expect.anything(),
      town_name: expect.any(String),
      postal_code: expect.stringMatching(/^\d{4}$/),
    })
  );
});

test("[BB][Property] GET_/person Repeat_50_Runs_No_Invalid_Fields", async () => {
  for (let i = 0; i < 50; i++) {
    const res = await client.get("/person");
    expect(res.status).toBe(200);
    const p = res.data[0];
    expect(p.phoneNumber).toMatch(/^\d{8}$/);
    expect(p.CPR).toMatch(/^\d{6}-\d{4}$/);

    // CPR prefix vs. DOB
    const dob = (p.birthDate || "").trim();
    const ddmmyy = /^\d{4}-\d{2}-\d{2}$/.test(dob)
      ? (() => { const [y,m,d]=dob.split("-"); return `${d}${m}${y.slice(-2)}`; })()
      : (() => { const [d,m,y]=dob.split("-"); return `${d}${m}${y.slice(-2)}`; })();
    expect(p.CPR.startsWith(ddmmyy)).toBe(true);
  }
});

