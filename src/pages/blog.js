import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

const BlogPage = () => {
  return (
    <Layout>
      <SEO title="Blog" />
      <div className="max-w-screen-md w-full self-center px-4 mt-32 text-indigo-900"></div>
    </Layout>
  );
};

export default BlogPage;
