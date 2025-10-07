import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSales } from '../features/sale/saleSlice';
import { getAllPurchases } from '../features/purchase/purchaseSlice';
import { getAllCustomers } from '../features/customer/customerSlice';
import { getAllProducts } from '../features/product/productSlice';
import { getAllSuppliers } from '../features/supplier/supplierSlice';
import { getAllUsers } from '../features/user/userSlice';
import { getAllReturns } from '../features/return/returnSlice';
import { getAllActivityLogs } from '../features/activityLog/activityLogSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const dispatch = useDispatch();
  const { data: sales = [] } = useSelector((state) => state.sale);
  const { data: purchases = [] } = useSelector((state) => state.purchase);
  const { data: products = [] } = useSelector((state) => state.product);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    dispatch(getAllSales());
    dispatch(getAllPurchases());
    dispatch(getAllCustomers());
    dispatch(getAllProducts());
    dispatch(getAllSuppliers());
    dispatch(getAllUsers());
    dispatch(getAllReturns());
    dispatch(getAllActivityLogs());
  }, [dispatch]);

  const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalPurchases = purchases.reduce((acc, purchase) => acc + purchase.totalAmount, 0);
  const totalDue = sales.reduce((acc, sale) => acc + sale.dueAmount, 0);

  const getSalesByHour = (sales) => {
    const salesByHour = new Array(24).fill(0);
    const today = new Date();
    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      if (saleDate.getDate() === today.getDate() && saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear()) {
        const hour = saleDate.getHours();
        salesByHour[hour] += sale.totalAmount;
      }
    });
    return salesByHour;
  };

  const getSalesByWeek = (sales, month) => {
    const salesByWeek = [0, 0, 0, 0];
    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      if (saleDate.getMonth() === month) {
        const weekOfMonth = Math.floor((saleDate.getDate() - 1) / 7);
        salesByWeek[weekOfMonth] += sale.totalAmount;
      }
    });
    return salesByWeek;
  };

  const getPurchasesByWeek = (purchases, month) => {
    const purchasesByWeek = [0, 0, 0, 0];
    purchases.forEach(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      if (purchaseDate.getMonth() === month) {
        const weekOfMonth = Math.floor((purchaseDate.getDate() - 1) / 7);
        purchasesByWeek[weekOfMonth] += purchase.totalAmount;
      }
    });
    return purchasesByWeek;
  };

  const todaySalesData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Today's Sales",
        data: getSalesByHour(sales),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const weeklySalesData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: `Weekly Sales for ${new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })}`,
        data: getSalesByWeek(sales, selectedMonth),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const weeklyPurchasesData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: `Weekly Purchases for ${new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })}`,
        data: getPurchasesByWeek(purchases, selectedMonth),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  const weeklyProfitData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: `Weekly Profit for ${new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })}`,
        data: getSalesByWeek(sales, selectedMonth).map((sale, i) => sale - getPurchasesByWeek(purchases, selectedMonth)[i]),
        fill: false,
        backgroundColor: 'rgb(255, 206, 86)',
        borderColor: 'rgba(255, 206, 86, 0.2)',
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Sales</h2>
          <p className="text-2xl">₹{totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Purchases</h2>
          <p className="text-2xl">₹{totalPurchases.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Due</h2>
          <p className="text-2xl">₹{totalDue.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-bold mb-2">Product Stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(product => (
            <div key={product._id} className="bg-gray-100 p-2 rounded-lg flex flex-col ">
              <img src={product.img} alt={product.name} className="w-full h-44 object-cover mb-2 rounded-lg" />
              <p className="font-bold">{product.name}</p>
              <p> <strong> Current Stock :</strong>{product.currentStock} {product.unitCategory}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Today's Sales</h2>
          <Line data={todaySalesData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Weekly Sales</h2>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="border p-2">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <Line data={weeklySalesData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Weekly Purchases</h2>
          <Line data={weeklyPurchasesData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Weekly Profit</h2>
          <Line data={weeklyProfitData} />
        </div>
      </div>
    </div>
  );
};

export default Home;