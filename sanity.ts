import { ClientConfig, createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const config: ClientConfig = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    apiVersion: "2023-06-29",
    useCdn: process.env.NODE_ENV === "production"
};

export const sanityClient = createClient(config);

export const urlFor = (source: SanityImageSource) => imageUrlBuilder(sanityClient).image(source);