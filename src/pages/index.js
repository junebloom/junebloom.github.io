import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    {/* Hero */}
    <section className="w-full h-screen relative flex justify-center items-center">
      {/* name container */}
      <div className="flex flex-col">
        {/* title */}
        <div className="text-6xl font-black">juniper</div>
        {/* subtitle */}
        <code className="text-right">software.engineer();</code>
      </div>
    </section>

    {/* Content */}
    <div className="max-w-screen-md mx-auto px-4 space-y-24">
      {/* Hire me */}
      <section className="flex flex-col space-y-2">
        <h2 className="font-bold p-2">
          Looking for help? Add me to your project.
        </h2>
        <code className="font-bold p-2 overflow-auto whitespace-no-wrap bg-indigo-100">
          {`import { Juniper } from "june.a.bloom@gmail.com";`}
        </code>
      </section>

      {/* Blog */}
      <section className="flex flex-col space-y-2">
        <h2 className="font-bold p-2">Read my documentation.</h2>
        <ul className="list-inside list-disc font-bold ml-8 underline">
          <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
          <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
          <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
          <li>See more</li>
        </ul>
      </section>

      {/* Projects */}
      <section className="flex flex-col space-y-2">
        <h2 className="font-bold p-2">Explore my source code.</h2>
        <ul className="font-bold flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <li className="relative flex md:flex-col items-center md:justify-center flex-grow md:h-56 p-2 bg-indigo-100">
            <span className="m-2 w-16 h-16 border-4 rounded-full border-indigo-600"></span>
            <div className="md:absolute md:bottom-0 flex flex-grow md:flex-col md:items-center justify-between">
              <div className="m-2 md:m-0">Project</div>
              <div className="m-2 md:m-0 md:mb-2">This is a project.</div>
            </div>
          </li>
          <li className="relative flex md:flex-col items-center md:justify-center flex-grow md:h-56 p-2 bg-indigo-100">
            <span className="m-2 w-16 h-16 border-4 rounded-full border-indigo-600"></span>
            <div className="md:absolute md:bottom-0 flex flex-grow md:flex-col md:items-center justify-between">
              <div className="m-2 md:m-0">Project</div>
              <div className="m-2 md:m-0 md:mb-2">This is a project.</div>
            </div>
          </li>
          <li className="relative flex md:flex-col items-center md:justify-center flex-grow md:h-56 p-2 bg-indigo-100">
            <span className="m-2 w-16 h-16 border-4 rounded-full border-indigo-600"></span>
            <div className="md:absolute md:bottom-0 flex flex-grow md:flex-col md:items-center justify-between">
              <div className="m-2 md:m-0">Project</div>
              <div className="m-2 md:m-0 md:mb-2">This is a project.</div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </Layout>
);

export default IndexPage;
