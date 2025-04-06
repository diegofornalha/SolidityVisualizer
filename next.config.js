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
  
  webpack: (config) => {
    // Alias para importações mais curtas
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': './src',
    };
    
    return config;
  },
};

module.exports = config;
