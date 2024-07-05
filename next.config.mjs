/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'avatar.iran.liara.run',
                pathname: '/public/**',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;