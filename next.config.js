/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.mjs';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  
  // Otimizações para produção
  output: 'standalone', // Cria build otimizado para produção
  poweredByHeader: false, // Remove o header X-Powered-By por segurança
  
  // Ignorar erros de TypeScript em produção
  typescript: {
    // Ignorar erros de TypeScript durante build de produção
    ignoreBuildErrors: true,
  },
  
  // Ignorar erros de ESLint em produção
  eslint: {
    // Ignorar erros de ESLint durante build de produção
    ignoreDuringBuilds: true,
  },
  
  webpack: (config, { dev, isServer }) => {
    // Alias para importações mais curtas
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': './src',
    };
    
    // Em produção, otimizações adicionais
    if (!dev) {
      // Otimização para chunks e carregamento
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
        }
      };
    }
    
    return config;
  },
};

export default config;
