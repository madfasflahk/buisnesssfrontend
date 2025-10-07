
// src/components/addSale/DagImageUpload.js

import React from 'react';
import { FaCamera } from 'react-icons/fa';

/**
 * This component handles the uploading of a DAG image.
 * - It shows a button to choose an image.
 * - It displays a preview of the selected image.
 */
const DagImageUpload = ({ dagImage, handleDagImageChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <label className="block text-md font-semibold text-gray-700 mb-3">Upload Dag Image</label>
      <div className="flex items-center gap-4">
        <input type="file" id="dag-upload" className="hidden" onChange={handleDagImageChange} accept="image/*" />
        <label
          htmlFor="dag-upload"
          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md inline-flex items-center transition-all text-sm"
        >
          <FaCamera className="mr-2" />
          <span>Choose Image</span>
        </label>
        {dagImage && <img src={dagImage} alt="Dag Preview" className="w-24 h-24 object-cover rounded-md shadow-sm" />}
      </div>
    </div>
  );
};

export default DagImageUpload;
