import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import { Layout } from "../components/Layout/Layout.js";
import { SEO } from "../components/SEO.js";
import { BlogPostPreview } from "../components/BlogPost/BlogPostPreview.js";

const BlogPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/blog/" } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
          }
          timeToRead
          excerpt(pruneLength: 280)
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="Blog" />
      <div className="self-center max-w-screen-md w-full px-4 mt-32">
        <ul className="space-y-24">
          {data.allMarkdownRemark.nodes.map(
            ({ fields, frontmatter, timeToRead, excerpt }) => (
              <li key={fields.slug}>
                <BlogPostPreview
                  title={frontmatter.title}
                  slug={fields.slug}
                  date={frontmatter.date}
                  timeToRead={timeToRead}
                  excerpt={excerpt}
                />
              </li>
            )
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default BlogPage;
