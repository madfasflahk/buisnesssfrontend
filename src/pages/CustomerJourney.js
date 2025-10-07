import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCustomerById } from '../features/customer/customerSlice';
import { getAllSales } from '../features/sale/saleSlice';

const CustomerJourney = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: customer, loading: customerLoading, error: customerError } = useSelector((state) => state.customer);
  const { data: sales, loading: salesLoading, error: salesError } = useSelector((state) => state.sale);

  useEffect(() => {
    dispatch(getCustomerById(id));
    dispatch(getAllSales());
  }, [dispatch, id]);

  const customerSales = sales.filter(sale => sale.customer._id === id);
  const totalSpent = customerSales.reduce((acc, sale) => acc + sale.total, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Journey</h1>
      {customerLoading || salesLoading ? (
        <p>Loading...</p>
      ) : customerError ? (
        <p>Error: {customerError}</p>
      ) : salesError ? (
        <p>Error: {salesError}</p>
      ) : customer ? (
        <div>
          <h2 className="text-xl font-bold">{customer.name}</h2>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone}</p>
          <p className="font-bold mt-2">Total Spent: ${totalSpent.toFixed(2)}</p>
          <h3 className="text-lg font-bold mt-4">Purchase History</h3>
          <table className="w-full mt-2">
            <thead>
              <tr>
                <th className="border-b p-2">Product</th>
                <th className="border-b p-2">Quantity</th>
                <th className="border-b p-2">Total</th>
                <th className="border-b p-2">Date</th>
                <th className="border-b p-2">More</th>
              </tr>
            </thead>
            <tbody>
              {customerSales.map(sale => (
                <tr key={sale._id}>
                  <td className="border-b p-2">{sale.product.name}</td>
                  <td className="border-b p-2">{sale.quantity}</td>
                  <td className="border-b p-2">${sale.total.toFixed(2)}</td>
                  <td className="border-b p-2">{new Date(sale.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Customer not found.</p>
      )}
    </div>
  );
};

export default CustomerJourney;