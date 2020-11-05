import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import {
  // FiMap,
  FiBox,
  FiMic,
  FiShare2,
  FiCode,
  FiGithub,
} from "react-icons/fi";

import { Layout } from "../components/Layout/Layout.js";
import { SEO } from "../components/SEO.js";
import { Hero } from "../components/Hero/Hero.js";
import { Section } from "../components/Section.js";
import { Tile } from "../components/Tile.js";

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/blog/" } }
        sort: { fields: frontmatter___date, order: DESC }
        limit: 3
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="Home" />
      <Hero />

      {/* Content */}
      <div className="max-w-screen-md w-full self-center px-4 space-y-24">
        {/* Hire me */}
        <Section title="Looking for help? Add me to your project.">
          <code className="font-mono font-bold text-indigo-400 overflow-auto whitespace-no-wrap p-3 rounded-sm bg-indigo-100">
            <span className="text-indigo-500">import</span>
            {" { "}
            <span className="text-indigo-600">Juniper</span>
            {" } "}
            <span className="text-indigo-500">from</span>{" "}
            <span className="text-red-400">
              "
              <a href="mailto:june.a.bloom@gmail.com">june.a.bloom@gmail.com</a>
              "
            </span>
            ;
          </code>
        </Section>

        {/* Blog */}
        <Section title="Read my documentation.">
          <ul className="list-inside list-disc ml-8 space-y-2 text-red-400">
            {data.allMarkdownRemark.nodes.map((post) => (
              <li key={post.fields.slug}>
                <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
              </li>
            ))}
            <li>
              <Link to="/blog/">See more</Link>
            </li>
          </ul>
        </Section>

        {/* Projects */}
        <Section title="Explore my source code.">
          <ul className="font-bold grid md:grid-cols-3 gap-2">
            {/*
            <Tile
              Icon={FiMap}
              title="Scrawl"
              subtitle="World-building Tool"
              href="https://github.com/junebloom/scrawl"
            />
            */}
            <Tile
              Icon={FiBox}
              iconTitle="Box Icon"
              title="Fae"
              subtitle="ECS Framework"
              href="https://github.com/junebloom/fae"
            />
            <Tile
              Icon={FiMic}
              iconTitle="Microphone Icon"
              title="Practical"
              subtitle="Audio Recorder"
              href="https://github.com/junebloom/practical"
            />
            <Tile
              Icon={FiShare2}
              iconTitle="Graph Icon"
              title="ScrawlGraph"
              subtitle="Spatial Data Format"
              href="https://github.com/junebloom/scrawlgraph"
            />
            <Tile
              Icon={FiCode}
              iconTitle="Code Icon"
              title="This Site"
              subtitle="Personal Page and Blog"
              href="https://github.com/junebloom/junebloom.github.io"
            />
            <Tile
              Icon={FiGithub}
              iconTitle="GitHub Icon"
              title="See More"
              subtitle="at GitHub"
              href="https://github.com/junebloom"
            />
          </ul>
        </Section>
      </div>
    </Layout>
  );
};

export default IndexPage;
