import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCustomerSaleList } from '../features/customer/customerSlice';
import DataTable from '../components/DataTable';
import moment from 'moment';
import { FaBoxes, FaBoxOpen, FaCalculator, FaCalendarAlt, FaTags, FaUserCircle } from 'react-icons/fa';

const CustomerSaleList = () => {
    const dispatch = useDispatch();
    const { customerId } = useParams();
    const { saleList, loading, error } = useSelector((state) => state.customer);

    useEffect(() => {
        dispatch(getCustomerSaleList(customerId));
    }, [dispatch, customerId]);


    const [saleLists, setSaleLists] = React.useState(saleList);
   

    useEffect(() => {
        const formatData = saleList.map(sale => ({
          ...sale,
          productList: sale?.products?.map(product => product.product.name) || [],
          quantityList: sale?.products?.map(product => ({
            quantity: product.quantity,
            unitCategory: product.unitCategory,
            pricePerUnit: product.unitPrice
          })) || [],
          totalAmountList: sale?.products?.map(product => product.totalAmount) || []
        }));

        setSaleLists(formatData);
      }, [saleList]);

    const columns = React.useMemo(
        () => [
            {
                Header: () => <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaCalendarAlt /> Date</div>,
                accessor: 'saleDate',
                Cell: ({ value }) => new Date(value).toLocaleDateString(),
                width: 100
            },
           
            {
                Header: () => <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaBoxOpen /> Product</div>,
                accessor: 'productList',
                Cell: ({ value, row }) => (
                    <ul className="list-disc list-inside">
                        {value && value?.map((item, i) => (
                            <ol key={i}>
                                <span className="font-medium"> {item}</span>
                            </ol>
                        ))}
                    </ul>
                )
            },
            {
                Header: () => <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaBoxes /> Quantity</div>,
                accessor: 'quantityList',
                Cell: ({ value, row }) => (
                    <ul className="list-disc list-inside">
                        {value && value?.map((item, i) => (
                            <ol key={i}>
                                <span className="font-medium">  {item.quantity} {item.unitCategory} x {item.pricePerUnit} </span>
                            </ol>
                        ))}
                    </ul>
                )
            },
            {
                Header: () => <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaTags /> Price</div>,
                accessor: 'totalAmountList',
                Cell: ({ value, row }) => (
                    <ul className="list-disc list-inside">
                        {value && value?.map((item, i) => (
                            <ol key={i}>
                                <span className="font-medium"> ₹ {item} /- </span>
                            </ol>
                        ))}
                    </ul>
                )
            },

            {
                Header: () => <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaCalculator /> Total</div>,
                accessor: 'totalAmount',
                Cell: ({ value }) => `₹${value}/-`
            },
            
            
            {
                Header: () => <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaUserCircle /> Created By</div>,
                accessor: 'createdBy',
                Cell: ({ value }) => (
                    <span className="font-medium">{value?.name || 'N/A'}</span>
                )
            },
            
        ],
        []
    );
    return (
        <div className="container mx-auto p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-semibold text-gray-800">Customer Sale List</h1>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-app-primary-500">Error: {error}</p>
            ) : (
                <DataTable columns={columns} data={saleLists} />
            )}
        </div>
    );
};

export default CustomerSaleList;
