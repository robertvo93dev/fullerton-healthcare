import React from 'react';
import {
    useTable,
    usePagination,
    useFilters,
    useGlobalFilter,
    useRowSelect,
    useSortBy
} from "react-table";
import * as filter from './Filter/Filter';
import { IndeterminateCheckbox } from './Selection/RowSelection';
import PropTypes from 'prop-types';
import { TableContainer, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, TableSortLabel } from '@material-ui/core';
import MaUTable from '@material-ui/core/Table'
import TablePaginationActions from './Pagination/TablePaginationActions';
import TableToolbar from './Toolbar/TableToolbar';
import './Table.scss';

// Our table component
export function Table({
    columns,
    data,
    fetchData,
    pageCount: controlledPageCount,
    skipPageReset = true,
    deleteRecordHandler = (selectedId) => { },
    addRecordHandler = () => { },
    TableName = '',
    showSelection = true,
    showAddRecord = true
}) {
    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: filter.fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: filter.DefaultColumnFilter,
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        gotoPage,
        setPageSize,
        allColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize, selectedRowIds, globalFilter },
    } = useTable(
        {
            columns,
            data,
            defaultColumn, // Be sure to pass the defaultColumn option
            filterTypes,
            autoResetPage: !skipPageReset,  //reset page after change (filter)
            pageCount: controlledPageCount,
            initialState: {
                hiddenColumns: ['createdBy', 'createdDate', 'updatedBy', 'updatedDate']
            }
            // manualPagination: true, // Tell the usePagination
        },
        useGlobalFilter,
        useFilters,
        useSortBy,
        usePagination,
        useRowSelect,
        hooks => {
            hooks.allColumns.push(columns => {
                if (showSelection) {
                    columns.unshift({
                        id: "selection",
                        // The header can use the table's getToggleAllRowsSelectedProps method
                        // to render a checkbox
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <div style={{ textAlign: "center" }}>
                                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                            </div>
                        ),
                        // The cell can use the individual row's getToggleRowSelectedProps method
                        // to the render a checkbox
                        Cell: ({ row }) => (
                            <div style={{ textAlign: "center" }}>
                                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                            </div>
                        )
                    });
                }
                return columns
            });
        }
    )

    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({ pageIndex, pageSize })
    }, [fetchData, pageIndex, pageSize])

    //Change row per page in pagination
    const handleChangeRowsPerPage = event => {
        setPageSize(Number(event.target.value))
    }
    //Change the selected page
    const handleChangePage = (event, newPage) => {
        gotoPage(newPage)
    }
    //pre-do to get selected record
    const preDeleteRecordHandler = () => {
        //get index of selected record
        let selectedRowIndex = Object.keys(selectedRowIds).map(x => parseInt(x, 10));
        //filter record
        let selectedRecord = data.filter((_, i) => {
            return selectedRowIndex.includes(i)
        });
        //send the record to handle page
        deleteRecordHandler(selectedRecord);
    }

    return (
        <TableContainer className="ReactTable">
            <TableToolbar
                showAddRecord={showAddRecord}
                numSelected={Object.keys(selectedRowIds).length}
                deleteRecordHandler={preDeleteRecordHandler}
                addRecordHandler={addRecordHandler}
                TableName={TableName}
                preGlobalFilteredRows={preGlobalFilteredRows}
                setGlobalFilter={setGlobalFilter}
                globalFilter={globalFilter}
                allColumns={allColumns}
            />
            <MaUTable {...getTableProps()} className="react-custom-table">
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell
                                    {...(column.id === 'selection'
                                        ? column.getHeaderProps()
                                        : column.getHeaderProps(column.getSortByToggleProps()))}
                                >
                                    {column.render('Header')}
                                    {column.id !== 'selection' ? (
                                        <TableSortLabel
                                            active={column.isSorted}
                                            // react-table has a unsorted state which is not treated here
                                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                                        />
                                    ) : null}
                                    <div className="table-header-filter">
                                        {(column.canFilter && !column.columnDisableGlobalFilter) ? column.render('Filter') : null}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter className="pagination">
                    <TableRow>
                        <TablePagination
                            // rowsPerPageOptions={[
                            //     5,
                            //     10,
                            //     25,
                            //     50,
                            //     100,
                            //     { label: 'All', value: controlledPageCount },
                            // ]}
                            colSpan={10000}
                            count={controlledPageCount}
                            rowsPerPage={pageSize}
                            page={pageIndex}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </MaUTable>
        </TableContainer>
    )
}

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    fetchData: PropTypes.func.isRequired,
    pageCount: PropTypes.number.isRequired,
    deleteRecordHandler: PropTypes.func.isRequired
}