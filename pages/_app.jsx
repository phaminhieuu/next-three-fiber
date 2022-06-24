import "../styles/globals.css";
import Layout from "../components/layouts/main";

function Website({ Component, pageProps, router }) {
  return (
    <Layout router={router}>
      <Component {...pageProps} key={router.route} />
    </Layout>
  );
}

export default Website;
