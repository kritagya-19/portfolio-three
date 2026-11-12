import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('dist/test-screenshots/trust-intro-test')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 2600))

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await new Promise((r) => setTimeout(r, 400))
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'bottom_page_verified.png') })

  const textFound = await page.evaluate(() => {
    return document.body.innerText.includes('SELECTED WORK') || document.body.innerText.includes('CRAFTED FOR IMPACT')
  })
  console.log('Is SELECTED WORK / CRAFTED FOR IMPACT present:', textFound)

  await browser.close()
  process.exit(0)
}

verify().catch(console.error)
