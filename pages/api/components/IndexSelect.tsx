interface IndexSelectProps {
    label: string;
    indices: string[];
    selectedValue: string;
    onChange: (value: string) => void;
}

const IndexSelect: React.FC<IndexSelectProps> = ({ label, indices, selectedValue, onChange }) => {
    return (
        <div>
            <h4>{label}</h4>
            <select
                value={selectedValue}
                onChange={(e) => onChange(e.target.value)}
                disabled={!indices.length}
            >
                <option value="" disabled>Select an index</option>
                {indices.map(index => (
                    <option key={index} value={index}>{index}</option>
                ))}
            </select>
        </div>
    );
};

export default IndexSelect;
