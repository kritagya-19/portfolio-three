import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function debug() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()))
  page.on('pageerror', (err) => console.log('PAGE ERR:', err.message))

  await page.goto('http://localhost:4173')
  await new Promise((r) => setTimeout(r, 2600))

  const dump = await page.evaluate(() => {
    // Check all elements in DOM
    const stage = document.querySelector('[style*="min-height"]')
    const aboutHeader = document.querySelector('header')
    const headline = document.querySelector('h2')
    return {
      scrollY: window.scrollY,
      stageOuter: stage ? stage.className : 'null',
      hasAboutHeader: !!aboutHeader,
      headlineText: headline ? headline.textContent : 'null',
      aboutPanel: document.querySelector('.shadow-\\[0_-25px_60px_rgba\\(0\\,0\\,0\\,0\\.85\\)\\]')
        ? document.querySelector('.shadow-\\[0_-25px_60px_rgba\\(0\\,0\\,0\\,0\\.85\\)\\]').outerHTML.slice(0, 300)
        : 'about panel not found',
    }
  })

  console.log('DUMP:', dump)

  // Scroll to 1000px and check again
  await page.evaluate(() => window.scrollTo(0, 1000))
  await new Promise((r) => setTimeout(r, 400))

  const dump1000 = await page.evaluate(() => {
    const el = document.querySelector('.shadow-\\[0_-25px_60px_rgba\\(0\\,0\\,0\\,0\\.85\\)\\]')
    return {
      scrollY: window.scrollY,
      aboutTransform: el ? el.style.transform : 'null',
    }
  })
  console.log('DUMP 1000:', dump1000)

  await browser.close()
}

debug().catch(console.error)

