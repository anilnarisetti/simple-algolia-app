import algoliasearch from 'algoliasearch';

interface CopyRuleParams {
    applicationID: string;
    adminAPIKey: string;
    sourceIndexName: string;
    targetIndexName: string;
    ruleId: string;
}

const copyRule = async ({
                            applicationID,
                            adminAPIKey,
                            sourceIndexName,
                            targetIndexName,
                            ruleId,
                        }: CopyRuleParams): Promise<void> => {

    if (sourceIndexName === targetIndexName) {
        throw new Error('Source and target index cannot be the same');
    }

    try {
        const client = algoliasearch(applicationID, adminAPIKey);
        const sourceIndex = client.initIndex(sourceIndexName);
        const targetIndex = client.initIndex(targetIndexName);

        // Fetch the rule from the source index
        const rule = await sourceIndex.getRule(ruleId);

        // Save the rule to the target index
        const result = await targetIndex.saveRule(rule);

        // Logging the task ID from the operation result
        console.log(`Rule ${ruleId} copied successfully from ${sourceIndexName} to ${targetIndexName}. TaskId: ${result.taskID}`);
    } catch (error) {
        console.error('Error during rule copy:', error);
        throw error;
    }
};

export default copyRule;
