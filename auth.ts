import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [GitHub],
    callbacks: {
        async signIn({ user: { name, email, image }, profile }) {
            const ghId = (profile as any)?.id;
            const login = (profile as any)?.login;
            const bio = (profile as any)?.bio ?? "";

            const existingUser = await client
                .withConfig({ useCdn: false })
                .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                    id: ghId,
                });
            if (!existingUser) {
                await writeClient.create({
                    _type: "author",
                    id: ghId,
                    name: name,
                    username: login,
                    email: email,
                    image: image,
                    bio: bio || "",
                });
            }
            return true;
        },
        async jwt({ token, account, profile }) {
            if (account && profile) {
                const ghId = (profile as any)?.id;
                const user = await client
                    .withConfig({ useCdn: false })
                    .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                        id: ghId,
                    });
                token.id = user?._id;
            }
            return token;
        },
        async session({ session, token }) {
            return { ...session, id: (token as any).id as string | undefined };
        },
    },
});
