import DefaultTheme from "vitepress/theme";
import "./custom.scss";

export default {
  ...DefaultTheme,
  NotFound: () => "404",
  enhanceApp({ app, router, siteData }) {},
};
