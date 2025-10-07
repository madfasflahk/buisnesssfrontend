import React, { useState, useEffect } from 'react';
import { Rnd } from "react-rnd";

const ProductModal = ({
  showModal,
  handleCloseModal,
  handleAddProduct,
  newProduct,
  setNewProduct,
  isClosing
}) => {
  const [conversionValues, setConversionValues] = useState({
    mon: '',
    kgForBag: '',
    peti: ''
  });

  // Conversion constants
  const MON_TO_KG = 40;      // 1 Mon = 40 KG
  const BAG_TO_KG = 50;      // 1 Bag = 50 KG
  const TRAY_TO_PETI = 7;    // 7 Tray = 1 Peti

  // Helper function to format numbers without trailing .000 for whole numbers
  const formatNumber = (num) => {
    if (num === '') return '';
    const number = parseFloat(num);
    if (isNaN(number)) return '';
    return number % 1 === 0 ? number.toString() : number.toString();
  };

  useEffect(() => {
    if (!newProduct.currentStock) {
      setConversionValues({ mon: '', kgForBag: '', peti: '' });
      return;
    }

    const stockValue = parseFloat(newProduct.currentStock);
    if (isNaN(stockValue)) return;

    switch (newProduct.unitCategory) {
      case 'KG':
        setConversionValues(prev => ({
          ...prev,
          mon: formatNumber((stockValue / MON_TO_KG).toString()),
          kgForBag: '',
          peti: ''
        }));
        break;
      case 'bag':
        setConversionValues(prev => ({
          ...prev,
          kgForBag: formatNumber((stockValue * BAG_TO_KG).toString()),
          mon: '',
          peti: ''
        }));
        break;
      case 'tray':
        setConversionValues(prev => ({
          ...prev,
          peti: formatNumber((stockValue / TRAY_TO_PETI).toString()),
          mon: '',
          kgForBag: ''
        }));
        break;
      default:
        break;
    }
  }, [newProduct.currentStock, newProduct.unitCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow numbers and decimals only
    if (name === 'name') {
      setNewProduct(prev => ({ ...prev, name: value }));
      return;
    } else {

      if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setNewProduct(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleConversionChange = (e) => {
    const { name, value } = e.target;
    // Allow numbers and decimals only
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      let calculatedStock = '';

      if (name === 'mon') {
        calculatedStock = value === '' ? 0 : parseFloat(value) * MON_TO_KG;
      } else if (name === 'kgForBag') {
        calculatedStock = value === '' ? 0 : parseFloat(value) / BAG_TO_KG;
      } else if (name === 'peti') {
        calculatedStock = value === '' ? 0 : parseFloat(value) * TRAY_TO_PETI;
      }

      setConversionValues(prev => ({ ...prev, [name]: value }));

      setNewProduct(prev => ({
        ...prev,
        currentStock: calculatedStock.toString()
      }));
    }
  };

  const handleUnitChange = (e) => {
    const { value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      unitCategory: value,
      currentStock: '',
      currentStock_bag: ''
    }));
    setConversionValues({ mon: '', kgForBag: '', peti: '' });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Rnd
        default={{
          x: window.innerWidth / 2 - 250,
          y: window.innerHeight / 2 - 220,
          width: 500,
        }}
        minWidth={320}
        minHeight={150}
        bounds="window"
        dragHandleClassName="drag-handle"
        enableResizing={true}
        className="bg-transparent flex items-center justify-center"
      >
        <div className={`bg-white rounded-lg shadow-lg flex flex-col ${isClosing ? "animate-slideFadeOut" : "animate-slideFadeIn"} w-full`}>
          {/* Header */}
          <div className="drag-handle cursor-move bg-primary-600 text-white flex justify-between items-center px-4 py-2 rounded-t-lg">
            <h2 className="text-lg font-semibold">
              {newProduct._id ? "Update Product" : "Add New Product"}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCloseModal}
                className="text-sm border shadow-sm shadow-white border-white px-3 py-1 rounded hover:bg-white hover:text-primary-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="text-sm px-3 py-1 rounded transition bg-white text-primary-600 border-white border shadow-sm shadow-white hover:bg-primary-600 hover:text-white"
              >
                Save
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {/* Product Name - No restrictions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name:
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>

            {/* Unit Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Category:
              </label>
              <select
                name="unitCategory"
                value={newProduct.unitCategory}
                onChange={handleUnitChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="KG">Kilograms (KG)</option>
                <option value="bag">Bags</option>
                <option value="tray">Trays</option>
              </select>
            </div>

            {/* Main Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Stock (in {newProduct.unitCategory}):
              </label>
              <input
                type="text"
                name="currentStock"
                value={newProduct.currentStock || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>

            {/* Conversion Fields */}
            {newProduct.unitCategory === 'KG' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mon (1 Mon = 40 KG):
                </label>
                <input
                  type="text"
                  name="mon"
                  value={conversionValues.mon}
                  onChange={handleConversionChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {newProduct.currentStock && (
                  <p className="text-sm text-gray-500 mt-1">
                    = {formatNumber(newProduct.currentStock)} KG
                  </p>
                )}
              </div>
            )}

            {newProduct.unitCategory === 'bag' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KG (1 Bag = 50 KG):
                </label>
                <input
                  type="text"
                  name="kgForBag"
                  value={conversionValues.kgForBag}
                  onChange={handleConversionChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {newProduct.currentStock && (
                  <p className="text-sm text-gray-500 mt-1">
                    = {formatNumber(newProduct.currentStock)} Bags
                  </p>
                )}
              </div>
            )}

            {newProduct.unitCategory === 'tray' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peti (7 Tray = 1 Peti):
                </label>
                <input
                  type="text"
                  name="peti"
                  value={conversionValues.peti}
                  onChange={handleConversionChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {newProduct.currentStock && (
                  <p className="text-sm text-gray-500 mt-1">
                    = {formatNumber(newProduct.currentStock)} Trays
                  </p>
                )}
              </div>
            )}

            {/* Only Additional Stock - Bags remains */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Stock (Bags):
              </label>
              <input
                type="text"
                name="currentStock_bag"
                value={newProduct.currentStock_bag || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default ProductModal;