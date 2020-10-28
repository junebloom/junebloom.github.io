import React from "react";
import { graphql } from "gatsby";

import { Layout } from "../components/Layout/Layout.js";
import { SEO } from "../components/SEO.js";
import { BlogPost } from "../components/BlogPost/BlogPost.js";

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
      }
      timeToRead
      html
    }
  }
`;

const BlogPostTemplate = ({ data }) => {
  const { timeToRead, html } = data.markdownRemark;
  const { title, date } = data.markdownRemark.frontmatter;

  return (
    <Layout>
      <SEO title={title} />
      <div className="self-center max-w-screen-md w-full px-4 mt-32">
        <BlogPost
          title={title}
          date={date}
          timeToRead={timeToRead}
          html={html}
        />
      </div>
    </Layout>
  );
};

export default BlogPostTemplate;
