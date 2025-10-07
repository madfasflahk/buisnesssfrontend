import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductById } from '../features/product/productSlice';
import { getAllSales } from '../features/sale/saleSlice';

const ProductJourney = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: product, loading: productLoading, error: productError } = useSelector((state) => state.product);
  const { data: sales, loading: salesLoading, error: salesError } = useSelector((state) => state.sale);

  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getAllSales());
  }, [dispatch, id]);

  const productSales = sales.filter(sale => sale.product._id === id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Journey</h1>
      {productLoading || salesLoading ? (
        <p>Loading...</p>
      ) : productError ? (
        <p>Error: {productError}</p>
      ) : salesError ? (
        <p>Error: {salesError}</p>
      ) : product ? (
        <div>
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p>Price: {product.price}</p>
          <p>Current Stock: {product.stock}</p>
          <h3 className="text-lg font-bold mt-4">Sales History</h3>
          <table className="w-full mt-2">
            <thead>
              <tr>
                <th className="border-b p-2">Customer</th>
                <th className="border-b p-2">Quantity</th>
                <th className="border-b p-2">Total</th>
                <th className="border-b p-2">Date</th>
                <th className="border-b p-2">More</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map(sale => (
                <tr key={sale._id}>
                  <td className="border-b p-2">{sale.customer.name}</td>
                  <td className="border-b p-2">{sale.quantity}</td>
                  <td className="border-b p-2">{sale.total}</td>
                  <td className="border-b p-2">{new Date(sale.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ProductJourney;