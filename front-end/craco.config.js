const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@contexts': path.resolve(__dirname, 'src/contexts/'),
      '@database': path.resolve(__dirname, 'src/database/'),
      '@error': path.resolve(__dirname, 'src/error/'),
      '@shared': path.resolve(__dirname, 'src/shared/'),
    }
  }
};
