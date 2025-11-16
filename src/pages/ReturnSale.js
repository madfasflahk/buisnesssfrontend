import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSaleById, updateSaleById } from '../features/sale/saleSlice';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ReturnSale = () => {
  const { id: saleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { saleDetails, loading, error } = useSelector((state) => state.sale);

  const [formData, setFormData] = useState({
    customer: '',
    products: [],
    notes: '',
    saleDate: '',
    discountTotal: 0,
    totalAmount: 0,
    payment: 0,
    SaleDue: 0,
    totalDue: 0,
  });

  // 🔹 Fetch sale on load
  useEffect(() => {
    if (saleId) dispatch(getSaleById(saleId));
  }, [dispatch, saleId]);
  console.log("saleDetails in return sale", saleDetails);
  // 🔹 Set form values once saleDetails come
  useEffect(() => {
    if (!saleDetails) return;

    setFormData({
      customer: saleDetails.customer?._id,
      products: saleDetails.products.map((p) => ({
        product: p.product?._id,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        discount: p.discount,
        totalAmount: p.totalAmount,
        paidAmountOnline: 0,
        paidAmountOffline: 0,
        dueAmount: p.totalAmount,
        totalBag: p.totalBag,
      })),
      notes: saleDetails.notes,
      saleDate: saleDetails.saleDate?.split("T")[0],
      discountTotal: saleDetails.discountTotal,
      totalAmount: saleDetails.totalAmount,
      payment: saleDetails.paidAmount,
      SaleDue: saleDetails.dueAmount,
      totalDue: saleDetails.customer?.totalDue || 0,
    });
  }, [saleDetails]);

  // 🔥 Only Quantity Change Allowed
  const handleQuantityChange = (index, value) => {
    const updated = [...formData.products];
    const qty = Number(value);

    updated[index].quantity = qty;
    updated[index].totalAmount = qty * updated[index].unitPrice;
    updated[index].dueAmount = updated[index].totalAmount; // because paid = 0

    setFormData({ ...formData, products: updated });
  };

  // 🔥 Recalculate summary values
  useEffect(() => {
    const totalAmount = formData.products.reduce((s, p) => s + p.totalAmount, 0);
    const totalDue = formData.products.reduce((s, p) => s + p.dueAmount, 0);

    setFormData((prev) => ({
      ...prev,
      totalAmount,
      SaleDue: totalDue,
    }));
  }, [formData.products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateSaleById({ id: saleId, saleData: formData }));
    navigate('/sales');
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-8">{error}</p>;
  if (!saleDetails) return <p className="text-center py-8">No sale found</p>;
  console.log("formData", formData.products);
  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Return / Edit Sale</h1>
        <button
          onClick={() => navigate('/sales')}
          className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Customer</label>
            <input
              type="text"
              value={saleDetails.customer?.name}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label>Sale Date</label>
            <input
              type="date"
              value={formData.saleDate}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>
        </div>

        {/* Products */}
        <div className="border p-4 rounded-lg bg-gray-50 space-y-4">
          <h2 className="text-xl font-semibold">Products</h2>

          {formData.products.map((item, index) => {
  const latData = saleDetails.products[index].latId;

  return (
    <div>

    
    <div
      key={index}
      className="grid grid-cols-2 md:grid-cols-8 gap-4 border-b pb-4"
    >
     
      <div>
        <label className='font-bold'>Product</label>
        <input
          type="text"
          value={saleDetails.products[index].product?.name}
          disabled
          className="w-full border px-3 py-2 bg-gray-100 rounded font-bold"
        />
        
      </div>

      {/* Pending Quantity */}
      


      {/* Quantity Editable */}
      <div>
        <label>Quantity (Editable)</label>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(index, e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Unit Price */}
      <div>
        <label>Unit Price</label>
        <input
          type="number"
          value={item.unitPrice}
          disabled
          className="w-full border px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      {/* Total Bags */}
      <div>
        <label>Total Bags</label>
        <input
          type="text"
          value={item.totalBag}
          disabled
          className="w-full border px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      {/* Total Amount */}
      <div>
        <label>Total Amount</label>
        <input
          type="number"
          value={item.totalAmount}
          disabled
          className="w-full border px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      {/* Due Amount */}
      <div>
        <label>Due Amount</label>
        <input
          type="number"
          value={item.dueAmount}
          disabled
          className="w-full border px-3 py-2 bg-gray-100 rounded"
        />
      </div>
    </div>
    <div className='bg-red-200 px-2 py-1'>

    {latData?.latNumber && (
      <p className="text-sm italic text-gray-600 mt-1">Lot: {latData.latNumber} , Pending: {latData?.pendingQuantity}{latData.unit==='KG'?` kg  ${latData?.pendingQuantity/40} mon   `:''} {latData?.pendingBag} {latData.unit==='KG'?'Bags':''}  </p>
    )}
    </div>
        </div>
  );
})}

        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>Total Amount</label>
            <input
              type="number"
              value={formData.totalAmount}
              disabled
              className="w-full border px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label>Total Due</label>
            <input
              type="number"
              value={formData.SaleDue}
              disabled
              className="w-full border px-3 py-2 bg-gray-100"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label>Notes</label>
          <textarea
            value={formData.notes}
            disabled
            className="w-full border px-3 py-2 bg-gray-100 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FaSave /> Update Sale
        </button>

      </form>
    </div>
  );
};

export default ReturnSale;
