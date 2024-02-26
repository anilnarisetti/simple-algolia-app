import type {NextApiRequest, NextApiResponse} from 'next';
import copyRule from "@/pages/api/algolia/copyRule";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const {appId, apiKey, selectedSourceIndex, selectedDestinationIndex, selectedRules} = req.body;
        try {
           // Wait all copy rules promises to complete
           await Promise.all(selectedRules.map(ruleId => copyRule({
                applicationID: appId,
                adminAPIKey: apiKey,
                sourceIndexName: selectedSourceIndex,
                targetIndexName: selectedDestinationIndex,
                ruleId: ruleId,
            })));
           res.status(200).json({message: 'Rules copied successfully'});
        } catch (error) {
            res.status(500).json({
                message: `Error copying rules from ${selectedDestinationIndex} to ${selectedDestinationIndex} with ${selectedRules}`,
                error
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
