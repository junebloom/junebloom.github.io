exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // Get blog post data
  const { data } = await graphql(`
    query {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { glob: "**/content/blog/*" }
          frontmatter: { published: { eq: true } }
        }
      ) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `);

  data.allMarkdownRemark.nodes.forEach((post) => {
    const slug = post.frontmatter.slug;
    createPage({
      path: `/blog/${slug}`,
      component: require.resolve("./src/templates/BlogPostTemplate.js"),
      context: { slug },
    });
  });
};
