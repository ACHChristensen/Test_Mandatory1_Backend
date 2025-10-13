import fs from "fs";
import { getRandomTown /*, TownRow^*/ } from "./Town";

interface FakePerson {
  CPR: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  birthDate: string;
  address: {
    street: string;
    number: string;
    floor: number;
    door: string;
    postal_code: string;
    town_name: string;
  };
  phoneNumber: string;
}

interface FakePersonJson {
  persons: [
    {
      firstName: string;
      lastName: string;
      gender: "male" | "female";
    }
  ];
}

const filePath: string = "./src/data/person-names.json";
const jsonData: FakePersonJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const PHONE_PREFIXES = [
    "2", "30", "31", "40", "41", "42", "50", "51", "52", "53", "60", "61", "71", "81", "91", "92", "93", "342", 
    "344", "345", "346", "347", "348", "349", "356", "357", "359", "362", "365", "366", "389", "398", "431", 
    "441", "462", "466", "468", "472", "474", "476", "478", "485", "486", "488", "489", "493", "494", "495", 
    "496", "498", "499", "542", "543", "545", "551", "552", "556", "571", "572", "573", "574", "577", "579", 
    "584", "586", "587", "589", "597", "598", "627", "629", "641", "649", "658", "662", "663", "664", "665", 
    "667", "692", "693", "694", "697", "771", "772", "782", "783", "785", "786", "788", "789", "826", "827", "829"
];

export default async function getFakeInfo(): Promise<FakePerson> {
  // Generate fake info
  const birthAndCpr: { birthDate: string; cpr: string } = setBirthAndCpr();
  const fullNameAndGender: {
    firstName: string;
    lastName: string;
    gender: "male" | "female";
  } = setFullNameAndGender();
  const address: {
    street: string;
    number: string;
    floor: number;
    door: string;
    postal_code: string;
    town_name: string;
  } = await setAddress();
  const phoneNumber: string = setPhone();

  const fakePerson: FakePerson = {
    CPR: birthAndCpr.cpr,
    firstName: fullNameAndGender.firstName,
    lastName: fullNameAndGender.lastName,
    gender: fullNameAndGender.gender,
    birthDate: birthAndCpr.birthDate,
    address: address,
    phoneNumber: phoneNumber,
  };

  return fakePerson;
}

function setBirthAndCpr(): { birthDate: string; cpr: string } {
  // Get random birth date
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - (Math.floor(Math.random() * 63) + 18); // 18-80 years old
  const birthMonth = Math.floor(Math.random() * 12) + 1; // 1-12
  const birthDay = Math.floor(Math.random() * 28) + 1; // 1-28

  const birthDate = `${birthDay.toString().padStart(2, "0")}-${birthMonth
    .toString()
    .padStart(2, "0")}-${birthYear}`;
  // Generate CPR based on birth date
  const cpr: string = setCpr(birthDate);

  return { birthDate, cpr };
}

function setFullNameAndGender(): {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
} {
  // Get random person from Local JSON file
  const randomIndex = Math.floor(Math.random() * jsonData.persons.length);
  const randomPersonData = jsonData.persons[randomIndex];

  return {
    firstName: randomPersonData.firstName,
    lastName: randomPersonData.lastName,
    gender: randomPersonData.gender,
  };
}

function setCpr(birthDate: string): string {
  const [day, month, year] = birthDate.split("-");
  const cprBase = `${day}${month}${year.slice(-2)}`;
  // Generate random 4 digits to complete CPR
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `${cprBase}-${randomDigits}`;
}

async function setAddress(): Promise<{
  street: string;
  number: string;
  floor: number;
  door: string;
  postal_code: string;
  town_name: string;
}> {
  // Generate a 10-20 character fake street name
  const street = generateRandomString(10, 20) + " Street";
  const number = (Math.floor(Math.random() * 200) + 1).toString(); // 1-200
  const floor = Math.floor(Math.random() * 10) + 1; // 1-10
  const door = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  // Get from MySQL database
  const randomTownName = await getRandomTown();
  const postal_code = randomTownName.cPostalCode;
  const town_name = randomTownName.cTownName;
  return { street, number, floor, door, postal_code, town_name };
}

function generateRandomString(minLength: number, maxLength: number): string {
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const characters = "abcdefghijklmnopqrstuvwxyzæøå";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result.charAt(0).toUpperCase() + result.slice(1); // Capitalize first letter
}

function setPhone(): string {
  const phonePrefix = //TODO - cath did: changed from let to const 
    PHONE_PREFIXES[Math.floor(Math.random() * PHONE_PREFIXES.length)];
  // Generate random 6 digits to complete phone number
  /*const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(5, "0");
    const phoneNumber = `${phonePrefix}${randomDigits}`;*/
  let phoneNumber = phonePrefix;
  for (let index = 0; index < 8 - phonePrefix.length; index++) {
    phoneNumber += Math.floor(Math.random() * 10);
  }

  return phoneNumber;
}
