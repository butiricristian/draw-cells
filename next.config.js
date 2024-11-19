module.exports = {
  images: {
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    return config;
  },
};
