import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "../features/customer/customerSlice";
import { getAllProducts } from "../features/product/productSlice";

// Conversion constants
const KG_PER_MON = 40; // 1 mon = 40 kg
const KG_PER_BAG = 50; // 1 bag = 50 kg
const TRAY_PER_PATI = 7; // 1 pati = 7 tray

// Helper function to format numbers
const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num) || num === "") {
    return "";
  }
  const parsedNum = parseFloat(num);
  if (parsedNum === 0) {
    return "";
  }
  return parsedNum.toFixed(2).replace(/\.00$/, "");
};

const SaleModal = ({
  showModal,
  handleCloseModal,
  handleAddSale,
  newSale,
  handleInputChange,
  isFormValid,
  isClosing,
  saleUpdateId,
  handleUnitCategoryChange
}) => {
  const dispatch = useDispatch();
  const { data: customers = [] } = useSelector((state) => state.customer);
  const { data: products = [] } = useSelector((state) => state.product);

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [unitCategory, setUnitCategory] = useState("");
  const [convertedValues, setConvertedValues] = useState({
    kg: "",
    mon: "",
    tray: "",
    pati: "",
    bag: "",
  });

  useEffect(() => {
    if (showModal) {
      dispatch(getAllCustomers());
      dispatch(getAllProducts());
      if (!newSale.saleDate) {
        handleInputChange({
          target: {
            name: "saleDate",
            value: new Date().toISOString().split("T")[0],
          },
        });
      }
    }
  }, [showModal, dispatch]);

  useEffect(() => {
    if (newSale.customer) {
      const customer = customers.find((c) => c._id === newSale.customer);
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer(null);
    }

    if (newSale.products) {
      const product = products.find((p) => p._id === newSale.products._id);
      setSelectedProduct(product);
      if (product) {
        setUnitCategory(product.unitCategory || "");
        handleUnitCategoryChange(product.unitCategory || "");
      }
    } else {
      setSelectedProduct(null);
      setUnitCategory("");
      handleUnitCategoryChange("");
    }
  }, [newSale.customer, newSale.products, customers, products]);

  // Handle unit conversions
  const handleUnitConversion = (name, value) => {
    const numValue = parseFloat(value) || 0;
    let newConvertedValues = { ...convertedValues };

    switch (name) {
      case "kg":
        newConvertedValues = {
          kg: value,
          mon: formatNumber(numValue / KG_PER_MON),
          tray: "",
          pati: "",
          bag: formatNumber(numValue / KG_PER_BAG),
        };
        break;
      case "mon":
        newConvertedValues = {
          kg: formatNumber(numValue * KG_PER_MON),
          mon: value,
          tray: "",
          pati: "",
          bag: formatNumber((numValue * KG_PER_MON) / KG_PER_BAG),
        };
        break;
      case "tray":
        newConvertedValues = {
          kg: "",
          mon: "",
          tray: value,
          pati: formatNumber(numValue / TRAY_PER_PATI),
          bag: "",
        };
        break;
      case "pati":
        newConvertedValues = {
          kg: "",
          mon: "",
          tray: formatNumber(numValue * TRAY_PER_PATI),
          pati: value,
          bag: "",
        };
        break;
      case "bag":
      default:
        newConvertedValues = {
          kg: formatNumber(numValue * KG_PER_BAG),
          mon: formatNumber((numValue * KG_PER_BAG) / KG_PER_MON),
          tray: "",
          pati: "",
          bag: value,
        };
    }

    setConvertedValues(newConvertedValues);
    handleInputChange({
      target: { name: "quantity", value: value || "" },
    });
  };

  useEffect(() => {
    let quantity = parseFloat(newSale.quantity) || 0;
    let price = parseFloat(newSale.Price_PerUnit) || 0;
    let totalAmount = 0;

    // Calculate based on unit category
    if (selectedProduct) {
      switch (unitCategory) {
        case "Kg":
          totalAmount = (parseFloat(convertedValues.kg) || 0) * price;
          break;
        case "Tray":
          totalAmount = (parseFloat(convertedValues.tray) || 0) * price;
          break;
        case "Bag":
          totalAmount = (parseFloat(convertedValues.bag) || 0) * price;
          break;
        default:
          totalAmount = quantity * price;
      }
    }

    const paidOnline = parseFloat(newSale.paidAmountOnline) || 0;
    const paidOffline = parseFloat(newSale.paidAmountOffline) || 0;
    const dueAmount = totalAmount - (paidOnline + paidOffline);

    handleInputChange({
      target: { name: "totalAmount", value: formatNumber(totalAmount) },
    });
    handleInputChange({
      target: { name: "dueAmount", value: formatNumber(dueAmount) },
    });
  }, [
    newSale.quantity,
    newSale.Price_PerUnit,
    newSale.paidAmountOnline,
    newSale.paidAmountOffline,
    selectedProduct,
    unitCategory,
    convertedValues,
  ]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setUnitCategory(product.unitCategory || "");
    handleUnitCategoryChange(product.unitCategory || "");
    setConvertedValues({
      kg: "",
      mon: "",
      tray: "",
      pati: "",
      bag: "",
    });
    handleInputChange({
      target: {
        name: "products",
        value: { _id: product._id, name: product.name },
      },
    });

    const fieldsToReset = [
      "quantity",
      "Price_PerUnit",
      "totalAmount",
      "paidAmountOnline",
      "paidAmountOffline",
      "dueAmount",
      "totalBag"
    ];

    fieldsToReset.forEach((field) => {
      handleInputChange({ target: { name: field, value: "" } });
    });

    handleInputChange({
      target: {
        name: "saleDate",
        value: new Date().toISOString().split("T")[0],
      },
    });
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    handleInputChange({
      target: { name: "customer", value: customer._id },
    });
  };

  const getStockDisplay = (unitCategory) => {
    if (!selectedProduct) return "";
    switch (unitCategory) {
      case "KG":
        return `${selectedProduct.currentStock || 0} kg (${formatNumber(
          (selectedProduct.currentStock || 0) / KG_PER_MON
        )} mon)`;
      case "tray":
        return `${selectedProduct.currentStock || 0} tray (${formatNumber(
          (selectedProduct.currentStock || 0) / TRAY_PER_PATI
        )} pati)`;
      case "bag":
        return `${selectedProduct.currentStock || 0} bag (${formatNumber(
          (selectedProduct.currentStock || 0) * KG_PER_BAG
        )} kg)`;
      default:
        return `${selectedProduct.currentStock || 0}`;
    }
  };

  const getNewStockDisplay = () => {
    if (!selectedProduct) return "";
    const currentStock = selectedProduct.currentStock || 0;
    const addedQuantity = parseFloat(newSale.quantity) || 0;
    const newStock = currentStock - addedQuantity;

    switch (unitCategory) {
      case "Kg":
        return `${formatNumber(newStock)} kg (${formatNumber(
          newStock / KG_PER_MON
        )} mon)`;
      case "Tray":
        return `${formatNumber(newStock)} tray (${formatNumber(
          newStock / TRAY_PER_PATI
        )} pati)`;
      case "Bag":
        return `${formatNumber(newStock)} bag (${formatNumber(
          newStock * KG_PER_BAG
        )} kg)`;
      default:
        return `${formatNumber(newStock)} units`;
    }
  };

  const getUnitLabel = () => {
    switch (unitCategory) {
      case "Kg":
        return "Price Per Kg";
      case "Tray":
        return "Price Per Tray";
      case "Bag":
        return "Price Per Bag";
      default:
        return "Price Per Unit";
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Rnd
        default={{
          x: window.innerWidth / 2 - 300,
          y: window.innerHeight / 2 - 250,
          width: 600,
          height: 600,
        }}
        minWidth={400}
        minHeight={500}
        bounds="window"
        dragHandleClassName="drag-handle"
        enableResizing={true}
        className="bg-transparent flex items-center justify-center"
      >
        <div
          className={`bg-white rounded-lg shadow-lg flex flex-col ${
            isClosing ? "animate-slideFadeOut" : "animate-slideFadeIn"
          } w-full h-full`}
        >
          <div className="drag-handle cursor-move bg-primary-600 text-white flex justify-between items-center px-4 py-2 rounded-t-lg">
            <h2 className="text-lg font-semibold">
              {saleUpdateId ? "Update Sale" : "Add New Sale"}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCloseModal}
                className="text-sm border border-white px-3 py-1 rounded hover:bg-white hover:text-primary-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSale}
                disabled={!isFormValid || !selectedCustomer || !selectedProduct}
                className={`text-sm px-3 py-1 rounded transition ${
                  isFormValid && selectedCustomer && selectedProduct
                    ? "bg-white text-primary-600 hover:bg-app-primary-100"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {saleUpdateId ? "Update" : "Save"}
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-auto">
            <div>
              <input
                type="text"
                placeholder="Search Customer"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                }}
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer._id}
                    onClick={() => handleCustomerSelect(customer)}
                    className={`border px-3 py-1 rounded ${
                      selectedCustomer?._id === customer._id
                        ? "bg-app-primary-100 border-app-primary-800"
                        : "bg-gray-100"
                    }`}
                  >
                    {customer.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Search Product"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                }}
                className="w-full border px-3 py-2 rounded mb-2"
                disabled={!selectedCustomer}
              />
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductSelect(product)}
                    className={`border px-3 py-1 rounded ${
                      selectedProduct?._id === product._id
                        ? "bg-app-primary-100 border-app-primary-800"
                        : "bg-gray-100"
                    }`}
                    disabled={!selectedCustomer}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedProduct && (
              <div className="p-2 bg-gray-100 rounded">
                <p>
                  <strong>Current Stock:</strong>{" "}
                  {getStockDisplay(unitCategory)}{" "}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quantity inputs based on unit category */}
              {unitCategory === "KG" && (
                <>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity (kg)
                    </label>
                    <input
                      type="text"
                      value={convertedValues.kg}
                      onChange={(e) =>
                        handleUnitConversion("kg", e.target.value)
                      }
                      placeholder="Quantity in kg"
                      className="w-full border px-3 py-2 rounded"
                      disabled={!selectedProduct}
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity (mon)
                    </label>
                    <input
                      type="text"
                      value={convertedValues.mon}
                      onChange={(e) =>
                        handleUnitConversion("mon", e.target.value)
                      }
                      placeholder="Quantity in mon"
                      className="w-full border px-3 py-2 rounded"
                      disabled={!selectedProduct}
                    />
                  </div>
                </>
              )}

              {unitCategory === "tray" && (
                <>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity (tray)
                    </label>
                    <input
                      type="text"
                      value={convertedValues.tray}
                      onChange={(e) =>
                        handleUnitConversion("tray", e.target.value)
                      }
                      placeholder="Quantity in tray"
                      className="w-full border px-3 py-2 rounded"
                      disabled={!selectedProduct}
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity (pati)
                    </label>
                    <input
                      type="text"
                      value={convertedValues.pati}
                      onChange={(e) =>
                        handleUnitConversion("pati", e.target.value)
                      }
                      placeholder="Quantity in pati"
                      className="w-full border px-3 py-2 rounded"
                      disabled={!selectedProduct}
                    />
                  </div>
                </>
              )}

              {unitCategory === "bag" && (
                <>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity (bag)
                    </label>
                    <input
                      type="text"
                      value={convertedValues.bag}
                      onChange={(e) =>
                        handleUnitConversion("bag", e.target.value)
                      }
                      placeholder="Quantity in bag"
                      className="w-full border px-3 py-2 rounded"
                      disabled={!selectedProduct}
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity (kg)
                    </label>
                    <input
                      type="text"
                      value={convertedValues.kg}
                      onChange={(e) =>
                        handleUnitConversion("kg", e.target.value)
                      }
                      placeholder="Quantity in kg"
                      className="w-full border px-3 py-2 rounded"
                      disabled={!selectedProduct}
                    />
                  </div>
                </>
              )}

              {!["Kg", "Tray", "Bag"].includes(unitCategory) && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formatNumber(newSale.quantity)}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: "quantity", value: e.target.value },
                      })
                    }
                    placeholder="Quantity"
                    className="w-full border px-3 py-2 rounded"
                    disabled={!selectedProduct}
                  />
                </div>
              )}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  {getUnitLabel()}
                </label>
                <input
                  type="text"
                  name="Price_PerUnit"
                  value={formatNumber(newSale.Price_PerUnit)}
                  onChange={handleInputChange}
                  placeholder={getUnitLabel()}
                  className="w-full border px-3 py-2 rounded"
                  disabled={!selectedProduct}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <input
                  type="text"
                  name="totalAmount"
                  value={formatNumber(newSale.totalAmount)}
                  placeholder="Total Amount"
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Paid Amount Online
                </label>
                <input
                  type="text"
                  name="paidAmountOnline"
                  value={formatNumber(newSale.paidAmountOnline)}
                  onChange={handleInputChange}
                  placeholder="Paid Amount Online"
                  className="w-full border px-3 py-2 rounded"
                  disabled={!selectedProduct}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Paid Amount Offline
                </label>
                <input
                  type="text"
                  name="paidAmountOffline"
                  value={formatNumber(newSale.paidAmountOffline)}
                  onChange={handleInputChange}
                  placeholder="Paid Amount Offline"
                  className="w-full border px-3 py-2 rounded"
                  disabled={!selectedProduct}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Amount
                </label>
                <input
                  type="text"
                  name="dueAmount"
                  value={formatNumber(newSale.dueAmount)}
                  placeholder="Due Amount"
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Bags
                </label>
                <input
                  type="text"
                  name="totalBag"
                  value={formatNumber(newSale.totalBag)}
                  onChange={handleInputChange}
                  placeholder="Total Bags"
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  disabled={!selectedProduct || unitCategory === "bag"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sale Date
                </label>
                <input
                  type="date"
                  name="saleDate"
                  value={
                    newSale.saleDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  disabled={!selectedProduct}
                />
              </div>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default SaleModal;
