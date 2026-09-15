module.exports = function(eleventyConfig) {
  // Pass through CNAME for custom domain
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Pass through styles
  eleventyConfig.addPassthroughCopy("src/styles");

  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "images",
    "src/assets/videos": "videos",
    "src/assets/audio": "audio"
  });

  // Pass through page-level assets (css, js, img)
  eleventyConfig.addPassthroughCopy("src/assets");

  // // Pass through images
  // eleventyConfig.addPassthroughCopy("src/assets/images");

  // // Pass through videos
  // eleventyConfig.addPassthroughCopy("src/assets/videos");

  // // Pass through audio
  // eleventyConfig.addPassthroughCopy("src/assets/audio");

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
