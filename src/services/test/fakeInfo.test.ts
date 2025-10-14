//import { getFakeInfo } from "../fakeInfo";
import getFakeInfo from "../fakeInfo";
import fs from "fs";
//import axios from "axios";
const PHONE_PREFIXES = [
  "2","30","31","40","41","42","50","51","52","53","60","61","71","81","91","92","93",
  "342","344","345","346","347","348","349","356","357","359","362","365","366","389","398",
  "431","441","462","466","468","472","474","476","478","485","486","488","489","493","494","495","496",
  "498","499","542","543","545","551","552","556","571","572","573","574","577","579","584","586","587",
  "589","597","598","627","629","641","649","658","662","663","664","665","667","692","693","694","697",
  "771","772","782","783","785","786","788","789","826","827","829"
];

interface FakePersonJson {
  persons: {
    firstName: string;
    lastName: string;
    gender: "male" | "female";
  }[];
}

describe("getFakeInfo()", () => {
  let person: Awaited<ReturnType<typeof getFakeInfo>>;
  const filePath: string = "./src/data/person-names.json";
  let jsonData: FakePersonJson;
  
  beforeAll(async () => {
    person = await getFakeInfo(); // await because it"s async // ✅ Jest waits for this
    const fileContents = fs.readFileSync(filePath, "utf-8");
    jsonData = JSON.parse(fileContents) as FakePersonJson;
    
  });

  test("should Phone-nr be defined, string, and 8 digits long", () => {
    // Check that phoneNumber exists and is a string
    expect(person.phoneNumber).toBeDefined();
    expect(typeof person.phoneNumber).toBe("string");
    expect(person.phoneNumber).toHaveLength(8);
    expect(person.phoneNumber).toMatch(/^\d{8}$/); // numeric check
  });

  test("should Phone-nr start with a valid prefix", () => {
    const hasValidPrefix = PHONE_PREFIXES.some(prefix =>
      person.phoneNumber.startsWith(prefix)
    );

    expect(hasValidPrefix).toBe(true);
  });
  // TODO - make adreess test 
  test("adreess ", () => {
     // Check that address exists and has expected fields
    expect(person.address).toBeDefined();
    expect(typeof person.address).toBe("object");
    
    expect(person.address.street).toBeDefined();
    expect(typeof person.address.street).toBe("string");
    //expect(person.address.street).toMatch(/^[A-Za-z]+$/); //without space in
    expect(person.address.street).toMatch(/^[\p{L} ]+$/u); // with space & Ø


    expect(person.address.number).toBeDefined();
    expect(typeof person.address.number).toBe("string");
    //Number. A number from 1 to 999 optionally followed by an uppercase letter 
    // (e.g.,1= true, 43B=true, 999Z=true, 0A=false, 1000=false, 50b=false(lowercase not allowed) )
    expect(person.address.number).toMatch(/^(?:[1-9]|[1-9]\d|[1-9]\d\d)[A-Z]?$/);

    expect(person.address.floor).toBeDefined();
    expect(typeof person.address.floor).toBe("string");
    expect(person.address.floor).toMatch(/^(?:st|[1-9]|[1-9]\d)$/); //Floor. Either “st” or a number from 1 to 99
    
    expect(person.address.door).toBeDefined();
    expect(typeof person.address.door).toBe("string");
    //Door. “th”, “mf”, “tv”, a number from 1 to 50, or a lowercase letter optionally followed by a dash, 
    // then followed by one to three numeric digits (e.g., c3, d-14)
    expect(person.address.door).toMatch(/^(?:th|mf|tv|[1-9]|[1-4]\d|50|[a-z])\-?\d{1,3}$/);

    expect(person.address.postal_code).toBeDefined();
    expect(typeof person.address.postal_code).toBe("string");


    expect(person.address.town_name).toBeDefined();
    expect(typeof person.address.town_name).toBe("string");
    expect(person.address.town_name).toBeDefined();

    //
    
  });

test("firstName,lastName and gender match json file", () => {
    expect(person.firstName).toBeDefined();
    expect(typeof person.firstName).toBe("string");
    expect(person.lastName).toBeDefined();
    expect(typeof person.lastName).toBe("string");
    const found = jsonData.persons.some(
      p => p.firstName === person.firstName && p.lastName === person.lastName &&
       person.gender === "male"|| person.gender === "female"
    );
    expect(found).toBe(true);
  });

  test("CPR match gender and birthdate", () => {
    expect(person.gender).toMatch(/male|female/);
    expect(person.CPR).toBeDefined();
    expect(typeof person.CPR).toBe("string");
    expect(person.CPR).toHaveLength(11);
    expect(person.birthDate).toBeDefined();
    expect(typeof person.birthDate).toBe("string");
    // CPR match birstday
    const cprPart = person.CPR.slice(0, 6);
    const birthday = person.birthDate;
    const parts = birthday.split("-"); // ["24", "11", "1971"]
    const ddmmyy = parts[0] + parts[1] + parts[2].slice(-2); // "241171"
    expect(cprPart).toBe(ddmmyy);

    // CPR gender rule: female → even, male → odd
   const lastDigit = parseInt(person.CPR.slice(-1), 10);
    if (person.gender === "female") {
      if((lastDigit % 2 === 0)=== false){
        console.log("fail female CPR lastDigit=(",lastDigit,") gender=(",person.gender,")");
      }
      expect(lastDigit % 2 === 0).toBeTruthy();

    }else if (person.gender === "male"){
      if((lastDigit % 2 !== 0)=== false){
        console.log("fail male CPR lastDigit=(",lastDigit,") gender=(",person.gender,")");
      }
      expect(lastDigit % 2 !== 0).toBeTruthy();
    }
    
  });
  
  test("returns complete fake person with phone and address", () => {
    // Check that phoneNumber exists and is a string
    /*expect(person.phoneNumber).toBeDefined();
    expect(typeof person.phoneNumber).toBe("string");
    expect(person.phoneNumber).toHaveLength(8);*/

    // Check that address exists and has expected fields
    expect(person.address).toBeDefined();
    expect(typeof person.address).toBe("object");
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
