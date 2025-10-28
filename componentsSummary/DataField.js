import React from 'react';

const DataField = ({ label, value }) => {
    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1').trim();
    return (
        <div className="flex justify-between">
            <dt className="font-medium text-gray-600">{formattedLabel}:</dt>
            <dd className="text-right font-bold text-gray-900">{value}</dd>
        </div>
    );
};

export default DataField;