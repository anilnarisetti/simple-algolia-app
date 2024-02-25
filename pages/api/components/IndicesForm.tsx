import React, { useState, ChangeEvent } from 'react';

interface IndexItem {
    name: string;
}

interface Rule {
    objectID: string;
}

interface IndicesResult {
    items: IndexItem[];
}

interface RulesResult {
    [indexName: string]: Rule[];
}

const IndicesForm: React.FC = () => {
    const [appId, setAppId] = useState('JKUHMJ7653');
    const [apiKey, setApiKey] = useState('3543317151b2fa0ddf7d8783603ef149');
    const [indicesResult, setIndicesResult] = useState<IndicesResult | null>(null);
    const [rulesResult, setRulesResult] = useState<RulesResult | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await fetch('/api/algolia/indices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appId, apiKey }),
        });
        const data = await response.json();
        setIndicesResult(data);
    };

    const onIndexSelected = async (indexName: string) => {
        const response = await fetch('/api/algolia/rules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appId, apiKey, indexName }),
        });
        const data = await response.json();
        setRulesResult({ ...rulesResult, [indexName]: data.rules });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Input fields */}
                <label htmlFor="appId">App ID:</label>
                <input
                    type="text"
                    id="appId"
                    className="input"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    required
                />
                <label htmlFor="apiKey">API Key:</label>
                <input
                    type="text"
                    id="apiKey"
                    className="input"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                />
                <button type="submit" className="button">Submit</button>
            </form>
            {/* Index Names List*/}
            {indicesResult && indicesResult.items && (
                <select onChange={(e: ChangeEvent<HTMLSelectElement>) => onIndexSelected(e.target.value)} defaultValue="">
                    <option value="" disabled>Select an index</option>
                    {indicesResult.items.map((index) => (
                        <option key={index.name} value={index.name}>
                            {index.name}
                        </option>
                    ))}
                </select>
            )}
            {/* Rules List */}
            {rulesResult && Object.keys(rulesResult).map((indexName) => (
                <div key={indexName}>
                    <h6>Index: {indexName}</h6>
                    {rulesResult[indexName].length > 0 ? (
                        <ul>
                            {rulesResult[indexName].map((rule) => (
                                <li key={rule.objectID}>
                                    <pre>{JSON.stringify(rule, null, 2)}</pre>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No rules found for this index</p>
                    )}
                </div>
            ))}
        </>
    );
};

export default IndicesForm;
