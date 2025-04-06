/**
 * Configuração Next.js para build na Vercel
 */

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  
  // Configurações para produção
  output: 'standalone',
  poweredByHeader: false,
  
  // Desabilitar verificações de TypeScript e ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  experimental: {
    esmExternals: 'loose',
  },
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': './src',
    };
    
    return config;
  },
};

export default config; 