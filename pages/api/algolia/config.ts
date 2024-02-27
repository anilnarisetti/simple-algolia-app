import type {NextApiRequest, NextApiResponse} from "next";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(200).json({
        appId: process.env.ALGOLIA_APPLICATION_ID, // Test account id Safe to expose to the frontend
        apiKey: process.env.ALGOLIA_ADMIN_API_KEY,  // Test api key Safe to expose to the frontend
        //TODO: Don't send sensitive keys directly to the frontend
    });
}