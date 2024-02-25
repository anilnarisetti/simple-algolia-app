import {SearchClient} from 'algoliasearch';
import {AlgoliaIndexRules} from '@/pages/api/types/algolia';

const getRulesForIndex = async (
    indexName: string,
    client: SearchClient
): Promise<AlgoliaIndexRules> => {
    const index = client.initIndex(indexName);

    let result = await index.searchRules('')

    return {
        indexName: indexName,
        rules: result?.hits || [],
        page: 0,
        numberOfPages: 0,
    };
}

export default getRulesForIndex;
