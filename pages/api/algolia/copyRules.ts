import type {NextApiRequest, NextApiResponse} from 'next';
import copyRule from "@/pages/api/algolia/copyRule";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const {appId, apiKey, selectedSourceIndex, selectedDestinationIndex, selectedRules} = req.body;
        try {
            // Explicitly declare the type of ruleId as string
            await Promise.all(selectedRules.map((ruleId: string) => copyRule({
                applicationID: appId,
                adminAPIKey: apiKey,
                sourceIndexName: selectedSourceIndex,
                targetIndexName: selectedDestinationIndex,
                ruleId: ruleId,
            })));
            res.status(200).json({message: 'Rules copied successfully'});
        } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred';
            if (error instanceof Error) {
                errorMessage = error.message || error.toString();
            }
            res.status(500).json({
                message: `Error copying rules from ${selectedSourceIndex} to ${selectedDestinationIndex} with ${selectedRules}`,
                error: errorMessage
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
