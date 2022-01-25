const withPWA = require("next-pwa");

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  reactStrictMode: true,
  env: {},
  pwa: {
    dest: "public",
    mode: "production",
    // disable: process.env.NODE_ENV === "development",
  },
});
