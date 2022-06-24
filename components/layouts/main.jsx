import Head from "next/head";
import React from "react";
import Navbar from "../navbar";

export default function Main({ children, router }) {
  return (
    <div className="min">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Next-Three-Fiber</title>
      </Head>

      <Navbar path={router.asPath} />

      {children}
    </div>
  );
}
