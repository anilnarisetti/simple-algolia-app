import {Rule} from "@algolia/client-search";

export interface AlgoliaIndexRules {
    indexName: string;
    rules: Rule[];
    page: number;
    numberOfPages: number;
}
