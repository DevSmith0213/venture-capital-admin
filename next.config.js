/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
                port: "",
            },
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                port: "",
            },
            {
              protocol: "https",
              hostname: "unicorn-nest.com",
              port: "",
            },
        ],
    },
};

module.exports = nextConfig;
