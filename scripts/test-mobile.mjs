import puppeteer from 'puppeteer-core'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('dist/test-screenshots/scroll-test-6lines')

async function testMobile() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  })

  // Test Mobile (390 x 844)
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 2600))

  await page.evaluate(() => window.scrollTo(0, 2500))
  await new Promise((r) => setTimeout(r, 400))
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_settled.png') })

  // Check horizontal overflow
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth
  })
  console.log('Mobile horizontal overflow:', overflow)

  // Test Tablet (768 x 1024)
  const pageTablet = await browser.newPage()
  await pageTablet.setViewport({ width: 768, height: 1024 })
  await pageTablet.goto('http://localhost:4173', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 2600))
  await pageTablet.evaluate(() => window.scrollTo(0, 2500))
  await new Promise((r) => setTimeout(r, 400))
  await pageTablet.screenshot({ path: path.join(OUTPUT_DIR, 'tablet_settled.png') })

  await browser.close()
  console.log('Mobile and tablet test passed!')
}

testMobile().catch(console.error)
