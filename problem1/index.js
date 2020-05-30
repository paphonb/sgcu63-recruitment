// assumption: we need to get all baans but the page from SSR only contains small size baans
//             so we need to execute client-side scripts to get everything
const puppeteer = require('puppeteer')
const baseUrl = 'https://rubnongkaomai.com'

async function getLinks() {
  const container = document.getElementsByClassName('baanGallery-module--gallery-app--2l-Y5')[0].children[0]
  const tablist = container.children[0]
  const tabs = tablist.getElementsByClassName('ant-tabs-tab')
  // Load all the tabs
  for (let tab of tabs) {
    tab.click()
  }
  const links = []
  const panes = document.getElementsByClassName('ant-tabs-tabpane')
  for (let pane of panes) {
    // Each baan is represented by a link node
    const baans = pane.getElementsByTagName('a')
    for (let baan of baans) {
      // Add the link to scrape
      links.push(baan.getAttribute('href'))
    }
  }
  return links
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
  console.log(await page.evaluate(getLinks))
  await browser.close()
}

scrape()
