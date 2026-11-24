import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
})
const page = await context.newPage()

try {
  const home = await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })
  if (!home?.ok()) throw new Error(`Homepage returned HTTP ${home?.status()}`)
  if (!(await page.getByRole('heading', { name: /a clearer read/i }).count())) {
    throw new Error('Homepage hero heading was not rendered')
  }

  const scan = await page.goto('http://127.0.0.1:3000/scan', { waitUntil: 'domcontentloaded' })
  if (!scan?.ok()) throw new Error(`Scanner returned HTTP ${scan?.status()}`)
  await page.getByRole('button', { name: /enter barcode manually/i }).click()
  const barcodeInput = page.getByLabel('Barcode number')
  await barcodeInput.waitFor({ state: 'visible' })
  await barcodeInput.fill('8901058851599')
  if (!(await page.getByRole('button', { name: /find product/i }).isVisible())) {
    throw new Error('Manual barcode fallback action is not visible')
  }

  console.log('Mobile smoke tests passed: homepage, scanner route, manual barcode fallback.')
} finally {
  await context.close()
  await browser.close()
}
