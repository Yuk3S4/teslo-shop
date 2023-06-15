import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface User {
      id?: string
      _id: string
  }
};


export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {
        console.log(credentials)    
        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' }    

        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password )
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here


  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks

  session: { // Duración de la sesón
    maxAge: 2592000, // 30 días
    strategy: 'jwt',
    updateAge: 86400, // cada día se actualizará
  },

  callbacks: {

    async jwt({ token, account, user }) {
      // console.log({ token, account, user })

      if ( account ) { // si tenemos una cuenta
        token.accessToken = account.access_token

        switch( account.type ) {
          case 'oauth':
            await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' )
          break

          case 'credentials':
            token.user = user
          break
        }
        
      }
    
      return token
    },

    async session({ session, token, user }) {
      // console.log({ token, session, user })

      session.accessToken = token.accessToken as any
      session.user = token.user as any
    
      return session
    }
    
  }
}

export default NextAuth(authOptions)