import type {NextApiRequest, NextApiResponse} from "next";
import algoliasearch from "algoliasearch";
import getRulesForIndex from "@/pages/api/algolia/getRulesForIndex";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { appId, apiKey, indexName } = req.body;
        const client = algoliasearch(appId, apiKey);
        try {
            const rulesPromise = getRulesForIndex(indexName, client);
            const rulesResult = await rulesPromise;
            res.status(200).json(rulesResult);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching Algolia rules', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}