import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import ErrorMessage from "@/pages/api/components/ErrorMessage";
import IndexSelect from "@/pages/api/components/IndexSelect";

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
    const [appId, setAppId] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('');
    const [indicesResult, setIndicesResult] = useState<IndicesResult | null>(null);
    const [rulesResult, setRulesResult] = useState<RulesResult | null>(null);
    const [selectedSourceIndex, setSelectedSourceIndex] = useState<string>('');
    const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<string>('');
    const [selectedRules, setSelectedRules] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = useCallback(async () => {
        const response = await fetch('/api/algolia/indices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appId, apiKey }),
        });
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            setIndicesResult(null);
            setErrorMessage('No indices found!');
        } else {
            setErrorMessage('');
            setIndicesResult(data);
        }
    }, [appId, apiKey]);

    useEffect(() => {
        handleSubmit();
    }, [handleSubmit]);

    useEffect(() => {
        // Fetch the config data from your API route
        const fetchConfig = async () => {
            const res = await fetch('/api/algolia/config');
            const config = await res.json();
            setAppId(config.appId || '');
            setApiKey(config.apiKey || '');
            // TODO: Since API Key shouldn't be fetched and stored in the frontend,
            // TODO: handle it securely server-side
        };
        fetchConfig();
    }, []); // Empty dependency array ensures this runs once on mount


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
        setErrorMessage('');
    };

    const handleRuleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedRules(selectedOptions);
    };

    const copyRules = async () => {
        console.log(`Copying rules ${selectedRules} from ${selectedSourceIndex} to ${selectedDestinationIndex}`);
        const destinationRulesResponse = await fetch('/api/algolia/rules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appId, apiKey, indexName: selectedDestinationIndex }),
        });
        const destinationRulesData = await destinationRulesResponse.json();
        const destinationRuleIds = destinationRulesData.rules.map((rule: Rule) => rule.objectID);
        const isRuleExisting = selectedRules.some(ruleId => destinationRuleIds.includes(ruleId));

        if (isRuleExisting) {
            setErrorMessage('One or more selected rules already exist in the destination index. Copy aborted.');
            return;
        }
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
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <label htmlFor="appId">App ID:</label>
                <input type="text" id="appId" className="input" value={appId} onChange={(e) => setAppId(e.target.value)} required />
                <label htmlFor="apiKey">API Key:</label>
                <input type="text" id="apiKey" className="input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
                <button type="submit" className="button">Load Indices</button>
            </form>

            <ErrorMessage message={errorMessage} />

            {indicesResult && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <IndexSelect
                        label="Source Index"
                        indices={indicesResult.items.map(item => item.name)}
                        selectedValue={selectedSourceIndex}
                        onChange={(value) => onIndexSelected(value, true)}
                    />
                    <IndexSelect
                        label="Destination Index"
                        indices={indicesResult.items.map(item => item.name)}
                        selectedValue={selectedDestinationIndex}
                        onChange={(value) => onIndexSelected(value, false)}
                    />
                </div>
            )}

            {selectedSourceIndex && (
                <>
                    <h6>Rules</h6>
                    <select multiple value={selectedRules} onChange={handleRuleSelection} style={{ width: '200px', height: '100px' }}>
                        {rulesResult?.[selectedSourceIndex]?.map(rule => (
                            <option key={rule.objectID} value={rule.objectID}>{rule.objectID}</option>
                        ))}
                    </select>
                    <button className="button" onClick={copyRules} disabled={selectedRules.length === 0 || !selectedDestinationIndex || selectedSourceIndex === selectedDestinationIndex}>
                        Copy Selected Rules
                    </button>
                </>
            )}
        </>
    );
};

export default IndicesForm;
