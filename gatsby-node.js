const slugify = require("slugify");

// Generate metadata for blog posts
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "MarkdownRemark") {
    const slug = slugify(node.frontmatter.title, { lower: true });

    createNodeField({
      node,
      name: "slug",
      value: `/blog/${slug}`,
    });
  }
};

// Generate blog post pages
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // Get blog post data
  const { data } = await graphql(`
    query {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/blog/" } }) {
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
