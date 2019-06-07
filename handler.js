const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");
const request = require("superagent");

module.exports.scrape = async (event, context) => {
  let browser = null;
  let response = null;
  let data = null

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    await page.goto("https://api.ussquash.com/login", { waitUntil: 'networkidle0' });

    await page.type('input[name="username"]', "bmosier");
    await page.type('input[name="password"]', "thunder7");
    await page.click('button[type="submit"]');

    await page.waitFor(".start-screen");
    await page.goto("https://clublocker.com/reservations/club-admin", { waitUntil: 'networkidle0' });

    data = await page.evaluate(async () => {
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

    data = data.filter(member => member.firstName !== undefined);

    const postUrl = "http://eqsquashswc.com/uploadMemberData.php";

    response = await request.post(postUrl).send(data);
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  console.log("Result: ", {
    ratingsData: data,
    postResponse: response.status
  });

  return context.succeed({
    statusCode: 200,
    body: JSON.stringify({
      ratingsData: data,
      postResponse: response.status
    })
  });
}
