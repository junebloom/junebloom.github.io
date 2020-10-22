import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    {/* Hero */}
    <section>
      {/* name container */}
      <div>
        {/* title */}
        <div>Juniper</div>
        {/* subtitle */}
        <code>software.engineer();</code>
      </div>
    </section>
    {/* Hire me */}
    <section>
      <h2>Looking for help? Add me to your project.</h2>
      <code>{`import { Juniper } from "june.a.bloom@gmail.com";`}</code>
    </section>
    {/* Blog */}
    <section>
      <h2>Read my documentation.</h2>
      <ul>
        <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
        <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
        <li>Is This a Blog Post? Yes This Is a Blog Post.</li>
        <li>See more</li>
      </ul>
    </section>
    {/* Projects */}
    <section>
      <h2>Explore my source code.</h2>
      <ul>
        <li>Project</li>
        <li>Project</li>
        <li>Project</li>
      </ul>
    </section>
  </Layout>
);

export default IndexPage;
