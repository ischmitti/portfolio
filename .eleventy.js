module.exports = function(eleventyConfig) {   
  
  eleventyConfig.addPassthroughCopy('./css/')
  eleventyConfig.addWatchTarget('./css/')
  eleventyConfig.addPassthroughCopy('./js/')
  eleventyConfig.addWatchTarget('./js/')
  eleventyConfig.addPassthroughCopy('./static/images/')
  eleventyConfig.addWatchTarget('./static/images/')
  eleventyConfig.addPassthroughCopy('./node_modules/')
  eleventyConfig.addWatchTarget('./node_modules/')

  return{
    dir: {
        input: '.',
        output: '_site',
        includes: 'includes',
    }
  }
};