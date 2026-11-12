import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('dist/test-screenshots/trust-intro-test')

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
  console.log('Waiting for hero cinematic intro to complete...')
  await new Promise((resolve) => setTimeout(resolve, 2600))

  console.log('1. Capturing Step 1: Resting Hero...')
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_hero_settled.png') })

  async function scrollToY(targetY) {
    await page.evaluate((y) => {
      window.scrollTo(0, y)
    }, targetY)
    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  // 2. Scroll to 450px: Hero bottom atmospheric blur transition
  console.log('2. Scrolling to 450px: Hero bottom blurred transition layer...')
  await scrollToY(450)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_hero_bottom_blur_transition.png') })

  // 3. Scroll to 850px: Centered Trust Factor Section emerges
  console.log('3. Scrolling to 850px: Centered Trust Factor Section...')
  await scrollToY(850)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_trust_factor_section.png') })

  // 4. Scroll to 1400px: Statement enters in heavily blurred state
  console.log('4. Scrolling to 1400px: Statement enters heavily blurred...')
  await scrollToY(1400)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_statement_initial_blurred.png') })

  // 5. Scroll to 1700px: First words sharp ("I BUILD DIGITAL"), rest blurred
  console.log('5. Scrolling to 1700px: First words sharp, rest blurred...')
  await scrollToY(1700)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_first_words_sharp.png') })

  // 6. Scroll to 2000px: Midway through statement, previous words remain sharp
  console.log('6. Scrolling to 2000px: Midway through statement...')
  await scrollToY(2000)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_midway_words_sharp.png') })

  // 7. Scroll to 2400px: All words sharp, supporting introduction reveals
  console.log('7. Scrolling to 2400px: All words sharp, supporting intro reveals...')
  await scrollToY(2400)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_statement_sharp_supporting_intro.png') })

  // 8. Scroll to 3000px: Pin releases naturally to Next Section
  console.log('8. Scrolling to 3000px: Pin releases naturally to next section...')
  await scrollToY(3000)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_pin_released_next_section.png') })

  // 9. Reverse scroll test: scroll back up to 1700px
  console.log('9. Reverse scroll to 1700px: Verifying reverse blur...')
  await scrollToY(1700)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_reverse_scroll_to_1700.png') })

  // 10. Reverse scroll back to 0px: Verifying Hero uncovered
  console.log('10. Reverse scroll back to 0px: Verifying Hero resting state...')
  await scrollToY(0)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_reverse_back_to_hero.png') })

  // 11. Mobile test (390 x 844)
  console.log('11. Testing Mobile 390x844...')
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' })
  await new Promise((resolve) => setTimeout(resolve, 2600))
  await scrollToY(600)
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_trust_section.png') })
  await scrollToY(1800)
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_statement_revealed.png') })

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth
  })
  console.log('Mobile horizontal overflow:', mobileOverflow)

  console.log('All tests completed successfully!')
  await browser.close()
  process.exit(0)
}

run().catch((err) => {
  console.error('Test error:', err)
  process.exit(1)
})

