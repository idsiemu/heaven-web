const withPlugins = require("next-compose-plugins");

const nextConfig = {
    env: {
      LANGUAGE: process.env.LANGUAGE,
      TOKEN: process.env.TOKEN,
      REFRESH_TOKEN: process.env.REFRESH_TOKEN,
      LANGUAGE_TYPE_NAME: process.env.LANGUAGE_TYPE_NAME,
      GQL_DOMAIN: process.env.GQL_DOMAIN,
      KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
      KAKAO_JS_KEY: process.env.KAKAO_JS_KEY,
      ENV: process.env.ENV,
    },
}
module.exports = withPlugins([], nextConfig);
