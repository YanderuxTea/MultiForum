import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  /* config options here */
};



module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.50.175'],
  images:{
    remotePatterns:[{
      protocol: 'https',
      hostname: 'i.imgur.com',
      port:'',
    }]
  }
}
export default nextConfig;
