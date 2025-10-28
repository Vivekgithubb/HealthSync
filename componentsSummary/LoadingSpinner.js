import React from 'react';

const LoadingSpinner = () => (
    <div id="loading-spinner" className="flex items-center ml-2">
        <span className="loading-dot w-3 h-3 bg-white rounded-full mx-0.5"></span>
        <span className="loading-dot w-3 h-3 bg-white rounded-full mx-0.5"></span>
        <span className="loading-dot w-3 h-3 bg-white rounded-full mx-0.5"></span>
    </div>
);

export default LoadingSpinner;