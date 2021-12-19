import NextAuth from "next-auth"
import spotifyApi,{ LOGIN_URL } from "../../../lib/spotify"
import SpotifyProvider from "next-auth/providers/spotify"
import GithubProvider from "next-auth/providers/github"

async function refreshAccessToken(token) {
  try{

    spotifyApi.setAccessToken(token.acessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
    console.log("refresh token is",refreshedToken);
    console.log("spotify api is", spotifyApi);

    return {
      ...token,
      acessToken: refreshedToken.access_token,
      acessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken

    }


  }catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError"
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({token, account, user}) {
      if(account && user) {
        return {
          ...token,
          acessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          acessTokenExpires: account.expires_at * 1000
        }
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token)
    },
    async session({ session, token}) {
      console.log("token is", token);
      session.user.accessToken = token.acessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username= token.username;
      return session;
    },
    async signIn(state) {
      console.log('sign in', state);
      return true
    },
    // async redirect(state) {
    //   console.log('redirect', state);
    // },
  }
})