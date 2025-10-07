import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReturns } from '../features/return/returnSlice';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Return = () => {
  const dispatch = useDispatch();
  const { data: returns, loading, error } = useSelector((state) => state.return);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    dispatch(getAllReturns());
  }, [dispatch]);

  const columns = React.useMemo(
    () => [
      { Header: 'Product', accessor: 'product.name' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Quantity', accessor: 'quantity' },
      { Header: 'Total', accessor: 'total' },
      { Header: 'Date', accessor: 'date' },
    ],
    []
  );

  const filteredReturns = React.useMemo(() => {
    if (!returns) return [];
    return returns.filter(item => {
      const returnDate = new Date(item.date);
      if (startDate && returnDate < startDate) return false;
      if (endDate && returnDate > endDate) return false;
      return true;
    });
  }, [returns, startDate, endDate]);

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setGlobalFilter, state: { pageIndex, pageSize, globalFilter } } = useTable({ columns, data: filteredReturns, initialState: { pageIndex: 0 } }, useGlobalFilter, usePagination);

  const handleDateFilter = () => {
    // Implement date filtering logic here
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Returns</h1>
      <div className="flex justify-between mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={"Search returns..."}
          className="border p-2"
        />
        <div className="flex space-x-2">
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="Start Date" className="border p-2" />
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} placeholderText="End Date" className="border p-2" />
          <button onClick={handleDateFilter} className="bg-blue-500 text-white p-2">Filter</button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="border-b p-2">{column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="border-b p-2">{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="pagination mt-4 flex justify-between">
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
        </div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default Return;
