import React from 'react'

import clsx from 'clsx'
import {
	Select, IconButton, Toolbar, Typography,
	Tooltip, FormControl, InputLabel, Input, MenuItem,
	Checkbox, ListItemText
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import GlobalFilter from '../Filter/GlobalFilter';

const useToolbarStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300,
	},
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === 'light'
			? {
				color: theme.palette.secondary.main,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark,
			},
	title: {
		flex: '1 1 100%',
	},
}))

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const TableToolbar = props => {
	const classes = useToolbarStyles()
	const {
		numSelected,
		deleteRecordHandler,
		addRecordHandler,
		preGlobalFilteredRows,
		setGlobalFilter,
		globalFilter = '',
		TableName = '',
		allColumns,
		showAddRecord
	} = props
	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}
		>
			{
				showAddRecord ?
					(
						<Tooltip title="Add">
							<IconButton aria-label="add" onClick={addRecordHandler}>
								<AddIcon />
							</IconButton>
						</Tooltip>
					) : (
						<div></div>
					)
			}

			{numSelected > 0 ? (
				<Typography
					className={classes.title}
					color="inherit"
					variant="subtitle1"
				>
					{numSelected} selected
				</Typography>
			) : (
					<Typography className={classes.title} variant="h6" id="tableTitle">
						{
							TableName
						}
					</Typography>
				)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete" onClick={deleteRecordHandler}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
					<GlobalFilter
						preGlobalFilteredRows={preGlobalFilteredRows}
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
					/>
				)}

			<FormControl className={classes.formControl}>
				<InputLabel id="columns-visible-label">Columns</InputLabel>
				<Select
					labelId="columns-visible-label"
					id="columns-visible-select"
					multiple
					value={["Select columns"]}
					input={<Input />}
					renderValue={(selected) => selected.join(', ')}
					MenuProps={MenuProps}
				>
					{allColumns.map(column => (
						<MenuItem key={column.id} value={column.id}>
							<Checkbox {...column.getToggleHiddenProps()} />
							<ListItemText primary={column.id} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Toolbar>
	)
}

TableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
	addRecordHandler: PropTypes.func.isRequired,
	deleteRecordHandler: PropTypes.func.isRequired,
	setGlobalFilter: PropTypes.func.isRequired,
	preGlobalFilteredRows: PropTypes.array.isRequired,
	allColumns: PropTypes.array.isRequired
}

export default TableToolbar
