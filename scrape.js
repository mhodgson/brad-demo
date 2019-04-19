const puppeteer = require("puppeteer");
const request = require("request-promise-native");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://api.ussquash.com/login");

  await page.type('input[name="username"]', "bmosier");
  await page.type('input[name="password"]', "thunder7");
  await page.click('button[type="submit"]');

  await page.waitFor(".start-screen");
  await page.goto("https://clublocker.com/reservations/club-admin");

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

  data.forEach(member => {
    console.log(`${member.firstName} ${member.lastName}: ${member.rating}`);
  });

  // const postUrl = "https://webhook.site/91af82ad-55d3-42b9-9db7-ad08b51d888d";
  const postUrl = "http://www.eqsquashswc.com/uploadMemberData.php";

  const response = await request.post(postUrl, {
    json: data
  });

  console.log(response);

  await browser.close();
})();
