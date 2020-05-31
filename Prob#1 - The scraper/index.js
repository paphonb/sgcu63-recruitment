// assumption: we need to get all baans but the page from SSR only contains small size baans
//             so we need to execute client-side scripts to get everything
const puppeteer = require('puppeteer')
const fetch = require('node-fetch')
const fs = require('fs')
const baseUrl = 'https://rubnongkaomai.com'
const namePattern = /<h1 type="header">(.*?)<\/h1>/
const sloganPattern = /<h3 type="header">(.*?)<\/h3>/

async function getBaanInfo(link) {
  console.log(`loading ${link}`)
  const response = await fetch(baseUrl + link)
  const html = await response.text()
  const name = html.match(namePattern)[1]
  const slogan = html.match(sloganPattern)[1]
  return { name, slogan }
}

function createTable(baans) {
  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>บ้านรับน้อง</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
      </head>
      <table class="table">
        <thead>
          <tr>
            <th>ชื่อบ้าน</th>
            <th>สโลแกน</th>
          </tr>
        </thead>
        <tbody>
          ${baans.map(baan => `
            <tr>
              <td>${baan.name}</td>
              <td>${baan.slogan}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </html>
  `
}

async function scrape() {
  const browser = await puppeteer.launch()
  try {
    const page = await browser.newPage()
    // for debugging
    page.on('console', msg => console.log('page:', msg.text()));
    await page.setViewport({
      width: 1600,
      height: 900,
    })
    await page.goto(`${baseUrl}/baan`)
    await page.waitForSelector('.ant-tabs div[role=tab]')

    const tabs = await page.$$('.ant-tabs div[role=tab]')

    // click tabs and wait for the page to render them
    for (let index = 0; index < tabs.length; index++) {
      tabs[index].click()
      const tabNo = index + 1
      console.log(`waiting for tab #${tabNo}`)
      await page.waitForSelector(`.ant-tabs-content > :nth-child(${tabNo}) > .ant-row a`)
    }

    // collect links of all baans
    const links = await page.$$eval('.ant-tabs-content > div > div > div > a', tags => {
      return tags.map(tag => tag.getAttribute('href'))
    })

    // collect info for each baan
    const baans = await Promise.all(links.map(getBaanInfo))

    // export data into table
    fs.writeFileSync('table.html', createTable(baans), 'utf8')
    console.log(`Successfully exported ${baans.length} entries to table.html`)
  } catch (e) {
    console.log(e)
    console.log('An error occurred. Please see the stack trace above.')
  } finally {
    await browser.close()
  }
}

scrape()
