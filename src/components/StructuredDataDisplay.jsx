import React from "react";
import { User, UserRound, Pill, AlertCircle } from "lucide-react";

export default function StructuredDataDisplay({ data }) {
  if (!data) return null;

  const { patientInfo, doctorInfo, medications } = data;

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-amber-500" />
          Patient Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{patientInfo.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{patientInfo.date || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{patientInfo.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Refills</p>
            <p className="font-medium">{patientInfo.refills || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Doctor Information */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2 mb-3">
          <UserRound className="w-5 h-5 text-amber-500" />
          Doctor Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{doctorInfo.name || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{doctorInfo.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{doctorInfo.phone || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Medications */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2 mb-3">
          <Pill className="w-5 h-5 text-amber-500" />
          Prescribed Medications
        </h3>
        {medications && medications.length > 0 ? (
          <div className="space-y-4">
            {medications.map((med, index) => (
              <div
                key={index}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <p className="font-medium text-blue-900">
                  {med.nameAndStrength}
                </p>
                <p className="text-gray-600 text-sm mt-1">{med.directions}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <AlertCircle className="w-5 h-5" />
            <p>No medications found in the document</p>
          </div>
        )}
      </div>
    </div>
  );
}
