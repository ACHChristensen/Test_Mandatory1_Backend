//import { getFakeInfo } from '../fakeInfo';
import getFakeInfo from "../fakeInfo";
//import axios from "axios";

describe("getFakeInfo()", () => {
  test("returns complete fake person with phone and address", async () => {
    const person = await getFakeInfo(); // await because it's async

    // Check that phoneNumber exists and is a string
    expect(person.phoneNumber).toBeDefined();
    expect(typeof person.phoneNumber).toBe("string");
    expect(person.phoneNumber).toHaveLength(8);
    //add so if 7leangth it starts with 2

    // Check that address exists and has expected fields
    expect(person.address).toBeDefined();
    expect(person.address.street).toBeDefined();
    expect(person.address.number).toBeDefined();
    expect(person.address.town_name).toBeDefined();

    // Check that personal info exists
    expect(person.firstName).toBeDefined();
    expect(person.lastName).toBeDefined();
    expect(person.gender).toMatch(/male|female/);
    expect(person.CPR).toBeDefined();
    expect(typeof person.CPR).toBe("string");
    expect(person.CPR).toHaveLength(11);
    expect(person.birthDate).toBeDefined();
  });
});
