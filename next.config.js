const withPlugins = require("next-compose-plugins");

const nextConfig = {
    env: {
      LANGUAGE: process.env.LANGUAGE,
      TOKEN: process.env.TOKEN,
      REFRESH_TOKEN: process.env.REFRESH_TOKEN,
      LANGUAGE_TYPE_NAME: process.env.LANGUAGE_TYPE_NAME,
      GQL_DOMAIN: process.env.GQL_DOMAIN,
      REST_KEY_KAKAO: process.env.REST_KEY_KAKAO,
      JS_KEY_KAKAO: process.env.JS_KEY_KAKAO,
      ENV: process.env.ENV,
    },
}
module.exports = withPlugins([], nextConfig);
