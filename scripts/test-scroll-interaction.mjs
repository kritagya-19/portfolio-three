import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('dist/test-screenshots/scroll-test-6lines')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function run() {
  console.log('Launching Puppeteer...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  console.log('Navigating to http://localhost:4173 ...')
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' })

  // 1. Wait for Hero loading animation to finish and settle
  console.log('Waiting for hero intro to complete...')
  await new Promise((resolve) => setTimeout(resolve, 2600))

  console.log('1. Capturing Step 1: Resting Hero at scroll 0...')
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_hero_settled.png') })

  async function scrollToY(targetY) {
    await page.evaluate((y) => {
      window.scrollTo(0, y)
    }, targetY)
    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  // 2. Scroll to 500px (About rises, Hero fixed underneath)
  console.log('2. Scrolling to 500px: About rising over stationary Hero...')
  await scrollToY(500)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_about_rising_over_hero.png') })

  // 3. Scroll to 950px (About covers Hero completely, all 6 lines blurred)
  console.log('3. Scrolling to 950px: About covers Hero, 6 lines blurred...')
  await scrollToY(950)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_about_covering_6lines_blurred.png') })

  // 4. Scroll to 1350px (Line 1 sharp, lines 2-6 blurred)
  console.log('4. Scrolling to 1350px: Line 1 sharp, lines 2-6 blurred...')
  await scrollToY(1350)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_line1_sharp.png') })

  // 5. Scroll to 1650px (Lines 1 & 2 sharp, lines 3-6 blurred)
  console.log('5. Scrolling to 1650px: Lines 1 & 2 sharp, lines 3-6 blurred...')
  await scrollToY(1650)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_lines1_2_sharp.png') })

  // 6. Scroll to 2000px (Lines 1, 2, 3, 4 sharp, lines 5 & 6 blurred)
  console.log('6. Scrolling to 2000px: Lines 1-4 sharp, lines 5-6 blurred...')
  await scrollToY(2000)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_lines1_to_4_sharp.png') })

  // 7. Scroll to 2500px (All 6 lines fully sharp and settled)
  console.log('7. Scrolling to 2500px: All 6 lines fully sharp and settled...')
  await scrollToY(2500)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_all_6lines_settled.png') })

  // 8. Scroll to 3100px (Pin released, Next Section scrolls into view)
  console.log('8. Scrolling to 3100px: Pin released, next section in view...')
  await scrollToY(3100)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_pin_released_next_section.png') })

  // 9. Reverse scroll test: scroll back up to 1600px
  console.log('9. Reverse scroll to 1600px: Verifying reverse blur...')
  await scrollToY(1600)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_reverse_scroll_to_1600.png') })

  // 10. Reverse scroll back to 0px: Verifying Hero uncovered
  console.log('10. Reverse scroll back to 0px: Verifying Hero uncovered...')
  await scrollToY(0)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_reverse_back_to_hero.png') })

  console.log('All screenshots captured successfully!')
  await browser.close()
  process.exit(0)
}

run().catch((err) => {
  console.error('Test error:', err)
  process.exit(1)
})
