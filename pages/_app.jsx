import "../styles/globals.css";
import Layout from "../components/layouts/main";
import MouseObserver from "../context/MouseObserver";

function Website({ Component, pageProps, router }) {
  return (
    <Layout router={router}>
      <MouseObserver>
        <Component {...pageProps} key={router.route} />
      </MouseObserver>
    </Layout>
  );
}

export default Website;
