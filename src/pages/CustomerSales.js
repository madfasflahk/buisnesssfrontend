import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSalesByCustomer } from '../features/sale/saleSlice';

const CustomerSales = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { salesByCustomer, loading } = useSelector((state) => state.sale);

  useEffect(() => {
    dispatch(getSalesByCustomer(customerId));
  }, [dispatch, customerId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales for Customer</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Total Amount</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Due Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {salesByCustomer.map((sale) => (
                <tr key={sale._id}>
                  <td className="w-1/3 text-left py-3 px-4">{new Date(sale.saleDate).toLocaleDateString()}</td>
                  <td className="w-1/3 text-left py-3 px-4">{sale.totalAmount}</td>
                  <td className="text-left py-3 px-4">{sale.dueAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerSales;