import { MetadataRoute } from 'next'
import { TOOLS } from '@/data/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://spaceryz.vercel.app'
  const locales = ['en', 'id']
  
  const staticRoutes = ['', '/chat', '/about', '/tools', '/games', '/games/sky-glide', '/games/stellar-oracle', '/games/space-typer', '/games/orbit-defense', '/games/void-runner']
  
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes for each locale
  locales.forEach(locale => {
    staticRoutes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    })
  })

  // Add tool routes for each locale
  locales.forEach(locale => {
    TOOLS.filter(tool => !tool.isComingSoon).forEach(tool => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/tools/${tool.category.toLowerCase()}/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  })

  return sitemapEntries
}
