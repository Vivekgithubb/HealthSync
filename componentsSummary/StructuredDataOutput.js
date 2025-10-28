import React from 'react';
import DataField from './DataField';
import MedicationItem from './MedicationItem';

const StructuredDataOutput = ({ isLoading, structuredData }) => {
    const data = structuredData;

    if (isLoading) {
        return (
            <div id="data-output" className="mt-3 space-y-4">
                <p className="text-indigo-500 italic">Extracting data...</p>
            </div>
        );
    }
    
    if (!data) {
        return <div id="data-output" className="mt-3 space-y-4"></div>;
    }

    if (data === 'error') {
        return (
            <div id="data-output" className="mt-3 space-y-4">
                <p className="text-red-600 font-semibold">Could not extract structured data.</p>
            </div>
        );
    }

    const { patientInfo, doctorInfo, medications } = data;

    return (
        <div id="data-output" className="mt-3 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-1 mb-2">Patient Information</h3>
                <dl className="space-y-1 text-sm text-gray-700">
                    {Object.entries(patientInfo).map(([key, value]) => (
                        <DataField key={key} label={key} value={value} />
                    ))}
                </dl>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-1 mb-2">Prescribing Doctor</h3>
                <dl className="space-y-1 text-sm text-gray-700">
                    {Object.entries(doctorInfo).map(([key, value]) => (
                        <DataField key={key} label={key} value={value} />
                    ))}
                </dl>
            </div>

            <div className="bg-indigo-100 p-4 rounded-lg shadow-inner">
                <h3 className="text-base font-semibold text-indigo-800 border-b border-indigo-300 pb-1 mb-2">Prescriptions & Directions</h3>
                <div className="space-y-3">
                    {medications && medications.length > 0 ? (
                        medications.map((med, index) => (
                            <MedicationItem 
                                key={index}
                                index={index} 
                                nameAndStrength={med.nameAndStrength} 
                                directions={med.directions}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No specific medications found in the document.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StructuredDataOutput;