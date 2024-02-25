import React, { useState, useEffect, ChangeEvent } from 'react';

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
    const [selectedSourceIndex, setSelectedSourceIndex] = useState<string>('');
    const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<string>('');
    const [selectedRules, setSelectedRules] = useState<string[]>([]);

    useEffect(() => {
        handleSubmit();
    }, []);

    const handleSubmit = async () => {
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

    const onIndexSelected = async (indexName: string, isSource: boolean = true) => {
        const response = await fetch('/api/algolia/rules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appId, apiKey, indexName }),
        });
        const data = await response.json();
        if (isSource) {
            setSelectedSourceIndex(indexName);
            setRulesResult({ ...rulesResult, [indexName]: data.rules });
        } else {
            setSelectedDestinationIndex(indexName);
        }
    };

    const handleRuleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedRules(selectedOptions);
    };

    const copyRules = async () => {
        console.log(`Copying rules ${selectedRules} from ${selectedSourceIndex} to ${selectedDestinationIndex}`);
        const response = await fetch('/api/algolia/copyRules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appId, apiKey, selectedSourceIndex, selectedDestinationIndex, selectedRules }),
        });
        const data = await response.json();
        console.log(data);
    };

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <label htmlFor="appId">App ID:</label>
                <input type="text" id="appId" className="input" value={appId} onChange={(e) => setAppId(e.target.value)} required />
                <label htmlFor="apiKey">API Key:</label>
                <input type="text" id="apiKey" className="input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
                <button type="submit" className="button">Load Indices</button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div>
                    <h2>Source Index</h2>
                    <select onChange={(e) => onIndexSelected(e.target.value, true)} value={selectedSourceIndex}>
                        <option value="" disabled>Select an index</option>
                        {indicesResult?.items.map(index => (
                            <option key={index.name} value={index.name}>{index.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <h2>Destination Index</h2>
                    <select onChange={(e) => onIndexSelected(e.target.value, false)} value={selectedDestinationIndex}>
                        <option value="" disabled>Select an index</option>
                        {indicesResult?.items.map(index => (
                            <option key={index.name} value={index.name}>{index.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedSourceIndex && (
                <>
                    <h3>Rules</h3>
                    <select multiple value={selectedRules} onChange={handleRuleSelection} style={{ width: '200px', height: '100px' }}>
                        {rulesResult?.[selectedSourceIndex]?.map(rule => (
                            <option key={rule.objectID} value={rule.objectID}>
                                {rule.objectID}
                            </option>
                        ))}
                    </select>
                    <button className="button" onClick={copyRules} disabled={selectedRules.length === 0 || !selectedDestinationIndex}>
                        Copy Selected Rules
                    </button>
                </>
            )}
        </>
    );
};

export default IndicesForm;
