/**
 * hexo-offline 配置文件 (v2 版本及以上)
 * 参考: https://github.com/JLHwung/hexo-offline#usage
 */

module.exports = {
  globDirectory: 'public',
  globPatterns: [
    '**/*.{js,css,png,jpg,gif,svg,eot,ttf,woff,woff2,json,xml,ico}'
  ],
  swDest: 'public/service-worker.js',
  maximumFileSizeToCacheInBytes: 10485760, // 10MB
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /\/$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-content',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 86400 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.html$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-content',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 86400 // 24 hours
        }
      }
    }
  ]
};