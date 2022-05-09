const waitPort = require('wait-port');
const request = require("supertest");
const superagent = require('superagent');
const shell = require('shelljs');

const { waitForUrl } = require('./util/url-util');

describe("Test the root path", () => {
  const BASE_URL = `http://localhost:5001/zara-images/us-central1/app`;
  let firebaseProc;
  beforeAll(async () => {
    const executionResult = shell.exec('npm run serve',{ async: true });

    //we wait until port is used
    await waitPort({ host: 'localhost', port: 5001 });
    const urlAvailable = await waitForUrl(BASE_URL+"/file-process/hello-world");
    console.log(urlAvailable);
    //await new Promise(resolve => setTimeout(resolve, 5000));
  });
  afterAll(async () => {
  });
  it("It should response the GET method", async () => {
    const response = await request(BASE_URL).get("/file-process/hello-world");
    expect(response.statusCode).toBe(200);
  });
});