import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { formatInteger } from "../utils/formatInteger.js";

import { Link } from "gatsby";
import { Layout } from "../components/Layout/Layout.js";
import { SEO } from "../components/SEO.js";

const BlogPage = () => {
  const data = useStaticQuery(graphql`
    query BlogPostsQuery {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { glob: "**/content/posts/*" }
          frontmatter: { published: { eq: true } }
        }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        nodes {
          frontmatter {
            title
            slug
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
      <div className="max-w-screen-md w-full self-center px-4 mt-32">
        <ul className="text-indigo-900 space-y-24">
          {data.allMarkdownRemark.nodes.map(
            ({ frontmatter, timeToRead, excerpt }) => (
              <li
                key={frontmatter.slug}
                className="flex flex-col items-center text-center space-y-4"
              >
                <Link
                  to={`/blog/${frontmatter.slug}`}
                  className="text-5xl font-black leading-none text-indigo-500 max-w-lg"
                >
                  {frontmatter.title}
                </Link>

                <div className="space-x-2 text-xl text-indigo-400">
                  <span>{frontmatter.date}</span>
                  <span>·</span>
                  <span>{`${formatInteger(timeToRead)} minute read`}</span>
                </div>

                <p className="text-left leading-7">
                  {excerpt}{" "}
                  <Link to={`/blog/${frontmatter.slug}`}>read more</Link>
                </p>
              </li>
            )
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default BlogPage;
