import {SearchClient} from 'algoliasearch';
import {AlgoliaIndexRules} from '@/pages/api/types/algolia';

const getRules = async (
    indexName: string,
    client: SearchClient
): Promise<AlgoliaIndexRules> => {
    const index = client.initIndex(indexName);

    let result = await index.searchRules('')

    return {
        indexName: indexName,
        rules: result?.hits || [],
        page: result?.page || 1,
        numberOfPages: result?.nbPages || 1,
    };
}

export default getRules;
