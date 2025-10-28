import React from 'react';

const MedicationItem = ({ index, nameAndStrength, directions }) => (
    <div className="p-3 bg-white rounded-md shadow-sm border border-indigo-200">
        <h4 className="font-bold text-base text-indigo-700">{index + 1}. {nameAndStrength}</h4>
        <p className="text-sm mt-1">
            <span className="font-medium text-gray-600">Directions:</span> 
            {directions}
        </p>
    </div>
);

export default MedicationItem;