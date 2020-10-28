import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Img from "gatsby-image";
import { Layout } from "../components/Layout/Layout.js";
import { SEO } from "../components/SEO.js";

const AboutPage = () => {
  const data = useStaticQuery(graphql`
    query AvatarImageQuery {
      file(relativePath: { eq: "avatar2.jpg" }) {
        childImageSharp {
          fixed(width: 360) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="About" />
      <div className="max-w-screen-md w-full self-center px-4 mt-32 text-indigo-900">
        <div className="flex flex-col items-center text-center space-y-4 my-4">
          <div className="flex relative">
            <div
              className="absolute bg-red-400 w-full h-full rounded-full"
              style={{ transform: "rotate(-30deg) translateY(0.5rem)" }}
            />
            <div
              className="absolute bg-indigo-500 w-full h-full rounded-full"
              style={{ transform: "rotate(-30deg) translateY(-0.5rem)" }}
            />
            <Img
              className="rounded-full"
              fixed={data.file.childImageSharp.fixed}
              alt="A photo of Juniper. She has curly brown hair with bangs, and is wearing glasses and a striped turtleneck."
            />
          </div>
          <h1 className="text-6xl font-black leading-none text-indigo-500">
            Juniper Bloom
          </h1>
          <h2 className="text-2xl text-indigo-400">- About Me -</h2>
        </div>
        <div className="space-y-8 leading-7">
          <p>
            My name is Juniper, of course, and you can refer to me using either
            she/her or they/them pronouns. I'm a programmer with a particular
            love for the web and for building lightweight tools that empower
            people to express themselves.
          </p>
          <p>
            I believe that cooperation is the most efficient way to make
            progress and that technology should be free and open. The web
            platform and the GNU/Linux platform that most of the web runs on are
            shining examples of what open technology can achieve. A brighter
            future awaits.
          </p>
          <p className="font-bold">
            I'm currently looking for work. Let me know if you're interested in
            making something wonderful together, you have any tips for me, or
            you just want to chat!
          </p>
          <p className="font-bold">
            You can email me at{" "}
            <a href="mailto:june.a.bloom@gmail.com">june.a.bloom@gmail.com</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;