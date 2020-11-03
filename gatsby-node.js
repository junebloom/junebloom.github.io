const slugify = require("slugify");

// Generate metadata for blog posts.
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (
    node.internal.type === "MarkdownRemark" &&
    node.fileAbsolutePath.includes("/blog/")
  ) {
    const slug = slugify(node.frontmatter.title, { lower: true });

    createNodeField({
      node,
      name: "slug",
      value: `/blog/${slug}/`,
    });
  }
};

// Generate blog post pages.
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // Get blog post data.
  // This shouldn't need to be sorted for simply generating the pages,
  // but somehow it breaks the sorting for subsequent queries when the
  // sort is omitted here???
  const { data } = await graphql(`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/blog/" } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `);

  data.allMarkdownRemark.nodes.forEach((post) => {
    const slug = post.fields.slug;
    createPage({
      path: slug,
      component: require.resolve("./src/templates/BlogPostTemplate.js"),
      context: { slug },
    });
  });
};
