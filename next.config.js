/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/dashboard.html',
        destination: 'https://www.hxo-lcr.cn/dashboard.html',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

