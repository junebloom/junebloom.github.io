import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Img from "gatsby-image";
import { Layout } from "../components/Layout/Layout.js";
import { SEO } from "../components/SEO.js";

const AboutPage = () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "avatar2.jpg" }) {
        childImageSharp {
          fixed(width: 360) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      markdownRemark(fileAbsolutePath: { glob: "**/content/about.md" }) {
        html
      }
    }
  `);

  return (
    <Layout>
      <SEO title="About" />
      <div className="max-w-screen-md w-full self-center px-4 mt-32 text-indigo-900">
        <div className="flex flex-col items-center text-center space-y-4 my-4">
          <div className="border-indigo-400 border-8 border-dashed p-4">
            <Img
              className="rounded"
              fixed={data.file.childImageSharp.fixed}
              alt="A photo of Juniper. She has curly brown hair with bangs, and is wearing glasses and a striped turtleneck."
            />
          </div>
          <h1 className="text-6xl font-black leading-none text-indigo-500">
            Juniper Bloom
          </h1>
          <h2 className="text-2xl text-indigo-500">- About Me -</h2>
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
        ></div>
      </div>
    </Layout>
  );
};

export default AboutPage;
