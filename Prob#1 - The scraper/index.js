// assumption: we need to get all baans but the page from SSR only contains small size baans
//             so we need to execute client-side scripts to get everything
const puppeteer = require('puppeteer')
const fetch = require('node-fetch')
const fs = require('fs')
const baseUrl = 'https://rubnongkaomai.com'
const namePattern = /<h1 type="header">(.*?)<\/h1>/
const sloganPattern = /<h3 type="header">(.*?)<\/h3>/

async function getLinks() {
  // promise version of setTimeout
  const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

  const container = document.getElementsByClassName('baanGallery-module--gallery-app--2l-Y5')[0].children[0]
  const tablist = container.children[0]
  const tabs = tablist.getElementsByClassName('ant-tabs-tab')
  const panes = document.getElementsByClassName('ant-tabs-tabpane')
  const links = []
  for (let tabNo = 0; tabNo < tabs.length; tabNo++) {
    const tab = tabs[tabNo]
    const pane = panes[tabNo]
    tab.click()

    // wait a bit for contents to render
    await timeout(500)

    // each baan is represented by a link node
    const baans = pane.getElementsByTagName('a')
    for (let baan of baans) {
      // add the link to scrape
      links.push(baan.getAttribute('href'))
    }
  }
  return links
}

async function getBaanInfo(link) {
  console.log(`getting info for ${link}`)
  const response = await fetch(link)
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
  const page = await browser.newPage()
  // for debugging
  page.on('console', msg => console.log('page:', msg.text()));
  await page.setViewport({
    width: 1600,
    height: 900,
  })
  await page.goto(`${baseUrl}/baan`)

  // collect links of all baans
  const links = await page.evaluate(getLinks)
  await browser.close()

  // collect info for each baan
  const baans = await Promise.all(links.map(link => getBaanInfo(baseUrl + link)))

  // export data into table
  fs.writeFileSync('table.html', createTable(baans), 'utf8')
}

scrape()
