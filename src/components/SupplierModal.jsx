import React from 'react';
import { Rnd } from "react-rnd";
import { FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const SupplierModal = ({
  showModal,
  handleCloseModal,
  handleAddSupplier,
  newSupplier,
  handleInputChange,
  isFormValid,
  isClosing
}) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Rnd
        default={{
          x: window.innerWidth / 2 - 250,
          y: window.innerHeight / 2 - 150,
          width: 500,
        }}
        minWidth={320}
        minHeight={250}
        bounds="window"
        dragHandleClassName="drag-handle"
        enableResizing={true}
        className="bg-transparent flex items-center justify-center"
      >
        <div className={`bg-white rounded-lg shadow-lg flex flex-col ${isClosing ? "animate-slideFadeOut" : "animate-slideFadeIn"} w-full`}>

          {/* Header */}
          <div className="drag-handle cursor-move bg-red-600 text-white flex justify-between items-center px-4 py-2 rounded-t-lg">
            <h2 className="text-lg font-semibold">Add New Supplier</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCloseModal}
                className="text-sm border border-white px-3 py-1 rounded hover:bg-white hover:text-app-primary-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                disabled={!isFormValid}
                className={`text-sm px-3 py-1 rounded transition ${isFormValid
                  ? "bg-white text-app-primary-600 hover:bg-app-primary-100"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                Save
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 p-4 space-y-3 overflow-auto">
            <div className="flex items-center border rounded px-3 py-2">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                name="name"
                value={newSupplier.name}
                onChange={handleInputChange}
                placeholder="Supplier Name"
                className="w-full outline-none"
              />
            </div>
            
            <div className="flex items-center border rounded px-3 py-2">
              <FaPhone className="text-gray-400 mr-3" />
              <input
                type="text"
                name="phone"
                value={newSupplier.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full outline-none"
              />
            </div>
            
            <div className="flex items-center border rounded px-3 py-2">
              <FaMapMarkerAlt className="text-gray-400 mr-3" />
              <input
                type="text"
                name="address"
                value={newSupplier.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full outline-none"
              />
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default SupplierModal;
