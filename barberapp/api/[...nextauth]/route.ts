import NextAuth from "next-auth"
import { Adapter } from "next-auth/adapters"
import GoogleProviders from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/app/_lib/prisma"


const handler = NextAuth({
    adapter: PrismaAdapter(db) as Adapter,
    providers: [GoogleProviders({
        clientId:"",
        clientSecret:""
    })
    ]   
})

export { handler as GET, handler as POST }