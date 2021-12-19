import Head from "next/head";
import { getSession, signOut } from "next-auth/react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Spotify | Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>funfo</p>
      <button onClick={signOut}>logout</button>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
