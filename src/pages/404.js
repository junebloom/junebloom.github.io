import React from "react";

import { Layout } from "../components/Layout/Layout.js";
import { SEO } from "../components/SEO.js";

const NotFoundPage = () => (
  <Layout>
    <SEO title="404 - Not Found" />
    <div className="flex-grow flex flex-col items-center justify-center leading-none">
      <h1 className="text-6xl font-black text-indigo-500">404</h1>
      <h2 className="text-2xl text-indigo-400">Not Found</h2>
      <p className="font-bold text-indigo-400 mt-2">
        That page doesn't seem to exist.
      </p>
    </div>
  </Layout>
);

export default NotFoundPage;
