import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  /* config options here */
};


module.exports = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [{
        key: 'X-Frame-Options',
        value: 'DENY',
      },{
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      }]
    }]
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.50.175'],
  images:{
    remotePatterns:[{
      protocol: 'https',
      hostname: 'i.imgur.com',
      port:'',
    }]
  },
  poweredByHeader:false,
}
export default nextConfig;
