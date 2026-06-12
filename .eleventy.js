module.exports = function(eleventyConfig) {
  // Pass through CNAME for custom domain
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Pass through styles
  eleventyConfig.addPassthroughCopy("src/styles");

  // Pass through page-level assets (css, js, img)
  eleventyConfig.addPassthroughCopy("src/assets");

  // Pass through images
  eleventyConfig.addPassthroughCopy("src/images");

  // Pass through videos
  eleventyConfig.addPassthroughCopy("src/videos");

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
