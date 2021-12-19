import { getProviders, signIn } from "next-auth/react";
import React from "react";

function login({ providers }) {
  return (
    <div>
      <h1>this is a login page</h1>
        <button
          onClick={() => {
            signIn(providers.spotify.id, { callbackUrl: "/teste/aaaa/bbbb" });
          }}
        >
          log in with {providers.spotify.name}
        </button>;
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
