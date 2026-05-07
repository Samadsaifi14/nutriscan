// lib/shopping-links.ts
// Generate shopping links for alternatives

// Your Amazon Associates Store ID
const AMAZON_AFFILIATE_ID = 'healthox-21'

export interface ShoppingLink {
  platform: 'amazon' | 'flipkart' | 'bigbasket' | 'blinkit' | 'zepto'
  url: string
}

const PLATFORM_SEARCH_URLS = {
  amazon: 'https://www.amazon.in',
  flipkart: 'https://www.flipkart.com',
  bigbasket: 'https://www.bigbasket.com',
  blinkit: 'https://www.blinkit.com',
  zepto: 'https://www.zepto.co.in',
}

export function getAmazonLink(productName: string, brand?: string): string {
  const searchTerm = encodeURIComponent(`${brand || ''} ${productName}`.trim())
  const tag = AMAZON_AFFILIATE_ID ? `ref=as_li_ss_tl&tag=${AMAZON_AFFILIATE_ID}` : ''
  const base = `https://www.amazon.in/s?k=${searchTerm}`
  return tag ? `${base}&${tag}` : base
}

export function getSearchLink(productName: string, platform: keyof typeof PLATFORM_SEARCH_URLS): string {
  const searchTerm = encodeURIComponent(productName)
  return `${PLATFORM_SEARCH_URLS[platform]}/search?q=${searchTerm}`
}

export function getAllShoppingLinks(productName: string, brand?: string): ShoppingLink[] {
  return [
    { platform: 'amazon', url: getAmazonLink(productName, brand) },
    { platform: 'flipkart', url: getSearchLink(productName, 'flipkart') },
    { platform: 'bigbasket', url: getSearchLink(productName, 'bigbasket') },
    { platform: 'blinkit', url: getSearchLink(productName, 'blinkit') },
    { platform: 'zepto', url: getSearchLink(productName, 'zepto') },
  ]
}

export const PLATFORM_INFO = {
  amazon: { name: 'Amazon', icon: '📦', color: '#FF9900', affiliate: true },
  flipkart: { name: 'Flipkart', icon: '🛒', color: '#2874f0', affiliate: false },
  bigbasket: { name: 'BigBasket', icon: '🥬', color: '#84c225', affiliate: false },
  blinkit: { name: 'Blinkit', icon: '⚡', color: '#f43c1f', affiliate: false },
  zepto: { name: 'Zepto', icon: '⚡', color: '#6C63FF', affiliate: false },
}

export function getBuyButtonText(platform: string): string {
  switch (platform) {
    case 'amazon': return 'Buy on Amazon'
    case 'flipkart': return 'View on Flipkart'
    case 'bigbasket': return 'Find on BigBasket'
    case 'blinkit': return 'Order on Blinkit'
    case 'zepto': return 'Order on Zepto'
    default: return 'Find Online'
  }
}