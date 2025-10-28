import React from "react";
import { FileText } from "lucide-react";

export default function FormattedSummary({ text }) {
  // Split the text by line breaks to handle paragraphs
  const paragraphs = text.split("\n").filter((p) => p.trim());

  // Function to format text with asterisks
  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove asterisks and wrap in styled span
        const content = part.slice(2, -2);
        return (
          <span key={index} className="font-semibold text-blue-900">
            {content}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-amber-500" />
        Document Analysis Summary
      </h3>
      <div className="prose prose-blue max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-700 leading-relaxed mb-4 last:mb-0"
          >
            {formatText(paragraph)}
          </p>
        ))}
      </div>
    </div>
  );
}
