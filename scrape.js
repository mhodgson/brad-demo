const scrapeIt = require("scrape-it");
const { Chromeless } = require("chromeless");

const chromeless = new Chromeless();

chromeless
  .setUserAgent(
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36"
  )
  .clearCookies()
  .goto("https://api.ussquash.com/login")
  .type("bmosier", 'input[name="username"]')
  .type("thunder7", 'input[name="password"]')
  .click('button[type="submit"]')
  .wait(".start-screen")
  .goto("https://clublocker.com/reservations/club-admin")
  .wait(".admin-view-container")
  .click("table tr:first-child a")
  .click('a[active-if-screen="members"]')
  .wait(5000)
  .html()
  .then(html => {
    data = scrapeIt.scrapeHTML(html, {
      data: {
        listItem: 'div[role="row"]',
        data: {
          firstName: {
            selector: 'div[role="gridcell"]',
            eq: 0
          },
          lastName: {
            selector: 'div[role="gridcell"]',
            eq: 1
          },
          rating: {
            selector: 'div[role="gridcell"]',
            eq: 5
          }
        }
      }
    });

    console.log(data);
  });
