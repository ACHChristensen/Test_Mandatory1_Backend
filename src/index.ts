import express, { Request, Response } from "express";
import fakeInfo from "./services/fakeInfo";

const app = express();
const PORT = 3000;

// Global Headers
app.use((req: Request, res: Response, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Accept-Version", "v1");
    next();
});

const apiLink = "/";

// Info route
app.get("/", async (req: Request, res: Response) => {
    res.send(`
        <a href="${apiLink}cpr">Get CPR</a><br/>
        <a href="${apiLink}name-gender">Get Name and Gender</a><br/>
        <a href="${apiLink}name-gender-dob">Get Name, Gender and DOB</a><br/>
        <a href="${apiLink}cpr-name-gender">Get CPR, Name and Gender</a><br/>
        <a href="${apiLink}cpr-name-gender-dob">Get CPR, Name, Gender and DOB</a><br/>
        <a href="${apiLink}address">Get Address</a><br/>
        <a href="${apiLink}phone">Get Phone</a><br/>
        <a href="${apiLink}person">Get Person</a><br/>
    `);
});

// API ENDPOINTS
app.get(apiLink + "cpr", async (req: Request, res: Response) => {
    const person = await fakeInfo();
    res.json({ CPR: person.CPR });
});
app.get(apiLink + "name-gender", async (req: Request, res: Response) => {
    const person = await fakeInfo();
    res.json({ firstName: person.firstName, lastName: person.lastName, gender: person.gender });
});
app.get(apiLink + "name-gender-dob", async (req: Request, res: Response) => {
    const person = await fakeInfo();
    res.json({ firstName: person.firstName, lastName: person.lastName, gender: person.gender, birthDate: person.birthDate });
});
app.get(apiLink + "cpr-name-gender", async (req: Request, res: Response) => {
    const person = await fakeInfo();
    res.json({ CPR: person.CPR, firstName: person.firstName, lastName: person.lastName, gender: person.gender });
});
app.get(apiLink + "cpr-name-gender-dob", async (req: Request, res: Response) => {
    const person = await fakeInfo();
    res.json({ CPR: person.CPR, firstName: person.firstName, lastName: person.lastName, gender: person.gender, birthDate: person.birthDate });
});
app.get(apiLink + "address", async (req: Request, res: Response) => {
    const person = await fakeInfo();
    res.json({ address: person.address });
});
app.get(apiLink + "phone", async (req: Request, res: Response) => {
    const person = await fakeInfo();
    res.json({ phoneNumber: person.phoneNumber });
});
app.get(apiLink + "person", async (req: Request, res: Response) => {
    const person = await fakeInfo();
    res.json({ person });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
