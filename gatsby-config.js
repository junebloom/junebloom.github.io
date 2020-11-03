module.exports = {
  siteMetadata: {
    title: `Juniper Bloom`,
    description: `software.engineer();`,
    author: `Juniper Bloom`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-prismjs`],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Juniper Bloom`,
        short_name: `Juniper Bloom`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#6f75f6`,
        display: `minimal-ui`,
        icon: `src/images/logo-square.svg`,
      },
    },
    `gatsby-plugin-postcss`,
  ],
};
