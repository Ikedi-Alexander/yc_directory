"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

type CreatePitchResult =
    | { status: "SUCCESS"; error: ""; _id: string }
    | { status: "ERROR"; error: string };

export const createPitch = async (
    state: any,
    form: FormData,
    pitch: string
): Promise<CreatePitchResult> => {
    const session = await auth();

    if (!session || !session.id)
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR",
        });

    const { title, description, category, link } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch")
    ) as Record<string, string>;

    const slug = slugify(title as string, { lower: true, strict: true });

    try {
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: { _type: "slug", current: slug },
            author: { _type: "reference", _ref: session.id },
            pitch,
        };

        const result = await writeClient.create({
            _type: "startup",
            ...startup,
        });
        console.log(session.id);
        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS",
        });
    } catch (error) {
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};
