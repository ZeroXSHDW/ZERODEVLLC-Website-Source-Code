/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/model.glb",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ["three", "framer-motion", "lucide-react"],
  },

  output: "standalone",

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Bundle analyzer
    if (process.env.ANALYZE === "true" && !isServer) {
      try {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "./analyze/client.html",
          }),
        );
      } catch (e) {
        // Bundle analyzer not installed
      }
    }

    // Handle GLB/GLTF files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
      generator: {
        filename: "static/models/[name].[hash][ext]",
      },
    });

    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          three: {
            test: /[\\/]node_modules[\\/]three[\\/]/,
            name: "three-vendor",
            chunks: "all",
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          fiber: {
            test: /[\\/]node_modules[\\/]@react-three\/fiber[\\/]/,
            name: "fiber-vendor",
            chunks: "all",
            priority: 15,
            reuseExistingChunk: true,
          },
          drei: {
            test: /[\\/]node_modules[\\/]@react-three\/drei[\\/]/,
            name: "drei-vendor",
            chunks: "all",
            priority: 14,
            reuseExistingChunk: true,
          },
          postprocessing: {
            test: /[\\/]node_modules[\\/]@react-three\/postprocessing[\\/]/,
            name: "postprocessing-vendor",
            chunks: "async",
            priority: 12,
            reuseExistingChunk: true,
          },
          xr: {
            test: /[\\/]node_modules[\\/]@react-three\/xr[\\/]/,
            name: "xr-vendor",
            chunks: "async",
            priority: 11,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](framer-motion|lucide-react|sonner)[\\/]/,
            name: "ui-vendor",
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
            minChunks: 2,
          },
        },
      };
    }

    return config;
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
