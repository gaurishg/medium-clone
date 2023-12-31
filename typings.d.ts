import { TypedObject } from "sanity";

export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    author: Author;
    description: string;
    mainImage: ImageItem;
    slug: Slug;
    // body: BlockItem[] | ImageItem[]
    body: TypedObject[]
}


export interface Author {
    name: string;
    image: string;
}

// interface ImageModel {
//     asset: {
//         url: string;
//     }
// }

interface Slug {
    current: string;
}

interface BlockItem {
    _key: string;
    _type: string;
    children: {
        _key: string;
        _type: string;
        marks: [];
        text: string;
    }[];
    markDefs: [];
    style: string;
}

interface ImageItem {
    _key?: string;
    _type: string;
    asset: {
        _ref: string;
        _type: string;
    };
}

export interface CommentFromSanity {
    approved: boolean;
    comment: string;
    email: string;
    name: string;
    post : {
        _ref: string;
        _type: string;
    },
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
}

export interface PostWithComments extends Post {
    comments: CommentFromSanity[]
}

export interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}