/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: 
        // localhost
        [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/uploads/**',
            },
            // strapi
            {
                protocol: 'https',
                hostname: 'strapi-eccomerce-production.up.railway.app',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
