const puppeteer = require("puppeteer");
const { getChrome } = require('./chrome-script');
const request = require("superagent");

module.exports.scrape = async (event) => {
  console.log("Function Started");
  const chrome = await getChrome();
  console.log("Chrome Acquired");
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });
  const page = await browser.newPage();

  console.log("Browser Loaded");

  await page.goto("https://api.ussquash.com/login", { waitUntil: 'networkidle0' });

  console.log("On Login Page");

  await page.type('input[name="username"]', "bmosier");
  console.log("Username entered");
  await page.type('input[name="password"]', "thunder7");
  console.log("Password entered");
  await page.click('button[type="submit"]');
  console.log("Login submitted");

  await page.waitFor(".start-screen");
  await page.goto("https://clublocker.com/reservations/club-admin", { waitUntil: 'networkidle0' });

  console.log("Logged In");

  const data = await page.evaluate(async () => {
    var url =
      "https://api.ussquash.com/resources/res/clubs/1392/members?PageNumber=1&RowsPerPage=1000";

    return await new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        success: resolve,
        error: reject
      });
    });
  });

  console.log("Data Fetched");

  data.forEach(member => {
    console.log(`${member.firstName} ${member.lastName}: ${member.rating}`);
  });

  const postUrl = "https://webhook.site/b8614e02-012c-484d-a453-432cc64314b6";
  // const postUrl = "http://www.eqsquashswc.com/uploadMemberData.php";

  const response = await request.post(postUrl).send(data.filter(member => member.firstName !== undefined));

  console.log("Data Posted");

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      ratingsData: data,
      postResponse: response.status
    })
  };
}
