//import { getFakeInfo } from '../fakeInfo';
import getFakeInfo from "../fakeInfo";
//import axios from "axios";
const PHONE_PREFIXES = [
  '2','30','31','40','41','42','50','51','52','53','60','61','71','81','91','92','93',
  '342','344','345','346','347','348','349','356','357','359','362','365','366','389','398',
  '431','441','462','466','468','472','474','476','478','485','486','488','489','493','494','495','496',
  '498','499','542','543','545','551','552','556','571','572','573','574','577','579','584','586','587',
  '589','597','598','627','629','641','649','658','662','663','664','665','667','692','693','694','697',
  '771','772','782','783','785','786','788','789','826','827','829'
];

describe("getFakeInfo()", () => {
  let person: Awaited<ReturnType<typeof getFakeInfo>>;
  beforeAll(async () => {
    person = await getFakeInfo(); // await because it's async // ✅ Jest waits for this
  });

  test('should Phone-nr be defined, string, and 8 digits long', async () => {
    // Check that phoneNumber exists and is a string
    expect(person.phoneNumber).toBeDefined();
    expect(typeof person.phoneNumber).toBe('string');
    expect(person.phoneNumber).toHaveLength(8);
    expect(person.phoneNumber).toMatch(/^\d{8}$/); // numeric check
  });

  test('should Phone-nr start with a valid prefix', () => {
    const hasValidPrefix = PHONE_PREFIXES.some(prefix =>
      person.phoneNumber.startsWith(prefix)
    );

    expect(hasValidPrefix).toBe(true);
  });


  
  test("returns complete fake person with phone and address", () => {
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
