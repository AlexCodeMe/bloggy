import NextAuth, { DefaultSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import authConfig from "./auth.config"

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id?: string
//       email?: string | null
//       image?: string | null
//       bio?: string | null
//       twitter?: string | null
//       facebook?: string | null
//       linkedin?: string | null
//       instagram?: string | null
//     } & DefaultSession['user']
//   }

//   interface User {
//     bio?: string | null
//     twitter?: string | null
//     facebook?: string | null
//     linkedin?: string | null
//     instagram?: string | null
//   }
// }

declare module "@auth/prisma-adapter" {
  interface AdapterUser {
    bio?: string | null
    twitter?: string | null
    facebook?: string | null
    linkedin?: string | null
    instagram?: string | null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
//   callbacks: {
//     async session({ token, session, user }) {
//       console.log({ sessionToken: token })
//       if (token.sub && session.user) {
//         session.user.id = token.sub
//       }

//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: token.sub,
//           email: user?.email || null,
//           image: user?.image || null,
//           bio: user?.bio || null,
//           twitter: user?.twitter || null,
//           facebook: user?.facebook || null,
//           linkedin: user?.linkedin || null,
//           instagram: user?.instagram || null,
//         },
//       }
//     },
//     async jwt({ token }) {
//       console.log({ token })
//       if (!token.sub) return token

//       return token
//     }
//   },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
