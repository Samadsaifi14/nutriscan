// lib/share-generator.ts
// Generate shareable content for social media

export interface ShareContent {
  title: string
  text: string
  url: string
}

export function generateShareContent(
  productName: string,
  healthScore: number,
  healthRating: string
): ShareContent {
  const scoreEmoji = healthScore >= 7.5 ? '✅' : healthScore >= 5.5 ? '⚠️' : '❌'
  const ratingText = healthRating === 'healthy' ? 'Healthy' : healthRating === 'moderate' ? 'Moderate' : 'Unhealthy'
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nutriscan-theta.vercel.app'
  const text = `${scoreEmoji} Scanned "${productName}" on Bio You\n📊 Health Score: ${healthScore}/10 (${ratingText})\n🔍 Check your food's health score!\n\n📱 ${appUrl}`
  
  return {
    title: `${productName} - Health Score: ${healthScore}/10`,
    text,
    url: appUrl,
  }
}