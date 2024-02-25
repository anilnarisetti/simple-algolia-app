import type { NextApiRequest, NextApiResponse } from 'next';
import algoliasearch from 'algoliasearch';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { appId, apiKey } = req.body;
        const client = algoliasearch(appId, apiKey);
        try {
            const indices = await client.listIndices();
            res.status(200).json(indices);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching Algolia indices', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
