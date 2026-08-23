/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; child-src 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; style-src-attr 'none'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://www.gstatic.com; worker-src 'self' blob:; manifest-src 'self'; media-src 'self' blob:; upgrade-insecure-requests",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), usb=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Origin-Agent-Cluster",
            value: "?1",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
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
