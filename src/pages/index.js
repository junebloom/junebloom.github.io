import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Hero } from "../components/hero";
import { Section } from "../components/section";
import { Tile } from "../components/tile";
import {
  FiBox,
  FiCode,
  FiGithub,
  FiMap,
  FiMic,
  FiShare2,
} from "react-icons/fi";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Hero />

    {/* Content */}
    <div className="relative lg:z-20 max-w-screen-md mx-auto px-4 space-y-24">
      {/* Hire me */}
      <Section title="Looking for help? Add me to your project.">
        <code className="font-mono font-bold text-indigo-900 p-2 overflow-auto whitespace-no-wrap bg-indigo-100">
          <span className="text-indigo-600">import</span>
          {" { "}
          <span className="text-indigo-500">Juniper</span>
          {" } "}
          <span className="text-indigo-600">from</span>{" "}
          <span className="text-red-400">
            "
            <a
              href="mailto:june.a.bloom@gmail.com"
              className="hover:text-red-500 hover:underline"
            >
              june.a.bloom@gmail.com
            </a>
            "
          </span>
          ;
        </code>
      </Section>

      {/* Blog */}
      <Section title="Read my documentation.">
        <ul className="list-inside list-disc ml-8 space-y-2 font-bold text-red-400 underline">
          <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
          <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
          <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
          <li>See more</li>
        </ul>
      </Section>

      {/* Projects */}
      <Section title="Explore my source code.">
        <ul className="font-bold grid md:grid-cols-3 gap-2">
          <Tile
            Icon={FiMap}
            title="Scrawl"
            subtitle="World-building Tool"
            href="https://github.com/junebloom/scrawl"
          />
          <Tile
            Icon={FiBox}
            title="Fae"
            subtitle="ECS Framework"
            href="https://github.com/junebloom/fae"
          />
          <Tile
            Icon={FiMic}
            title="Practical"
            subtitle="Audio Recorder"
            href="https://github.com/junebloom/practical"
          />
          <Tile
            Icon={FiShare2}
            title="Adjacency List"
            subtitle="Graph Data Structure"
            href="https://github.com/junebloom/adjacency-list"
          />
          <Tile
            Icon={FiCode}
            title="This Site"
            subtitle="Personal Page and Blog"
            href="https://github.com/junebloom/junebloom.github.io"
          />
          <Tile
            Icon={FiGithub}
            title="See more"
            subtitle="at GitHub"
            href="https://github.com/junebloom"
          />
        </ul>
      </Section>
    </div>
  </Layout>
);

export default IndexPage;
