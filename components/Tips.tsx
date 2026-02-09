import React from 'react';
import { Info } from 'lucide-react';

const Tips: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 md:p-5 flex items-start gap-3 mt-6">
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-blue-900">
        <h4 className="font-semibold mb-2">Tips for best results:</h4>
        <ul className="space-y-1.5 list-disc list-inside text-blue-800/80">
          <li>Ensure your face is well-lit and clearly visible</li>
          <li>Remove dark glasses or hats if possible</li>
          <li>Look directly at the camera</li>
          <li>Keep a neutral, professional expression</li>
        </ul>
      </div>
    </div>
  );
};

export default Tips;
