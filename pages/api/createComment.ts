import { sanityClient } from "@/sanity";
import { IFormInput } from "@/typings";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createComment(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {_id, name, email, comment} = JSON.parse(req.body) as IFormInput;
    try {
        await sanityClient.create({
            _type: "comment",
            post: {
                _type: 'reference',
                _ref: _id
            },
            name,
            email,
            comment
        });
    } catch (error) {
        return res.status(500).json({ message: "Couldn't submit comment", error});
    }
    res.status(200).json({ message: "Comment submitted" });
}