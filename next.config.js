/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/code' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/code/' : '',
}

export default nextConfig
