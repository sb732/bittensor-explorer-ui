/** @jsxImportSource @emotion/react */
import {
	Children,
	cloneElement,
	HTMLAttributes,
	ReactElement,
	ReactNode,
} from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { css, Interpolation, Theme } from "@emotion/react";

import { Pagination } from "../hooks/usePagination";
import { SortOrder } from "../model/sortOrder";

import { ErrorMessage } from "./ErrorMessage";
import Loading from "./Loading";
import NotFound from "./NotFound";
import { TablePagination } from "./TablePagination";
import { SortDirection } from "../model/sortDirection";
import { TablePaginationHeader } from "./TablePaginationHeader";
import { TableFilter } from "./TableFilter";

const tableStyle = css`
  table-layout: auto;
  width: max-content;
  min-width: 100%;

  & > thead > tr > th,
  & > tbody > tr > td {
    border: none !important;
  }

  & > tbody > tr {
    background-color: #1a1a1a;
  }

  & > tbody > tr:nth-of-type(odd) {
    background-color: rgba(18, 18, 18, 0.86);
    -webkit-box-shadow: inset 0 0 8px 0 rgba(255, 255, 255, 0.05);
    -moz-box-shadow: inset 0 0 8px 0 rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 0 8px 0 rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  & > thead > tr > th:first-of-type,
  & > tbody > tr > td:first-of-type {
    padding-left: 20px;
  }

  & > thead > tr > th:last-child,
  & > tbody > tr > td:last-child {
    padding-right: 20px;
  }
`;

const cellStyle = (theme: Theme) => css`
  word-break: break-all;
  border: none;
  color: ${theme.palette.secondary.dark};

  &:first-of-type {
    padding-left: 0;
  }

  &:last-of-type {
    padding-right: 0;
  }
`;

const activeHeader = (theme: Theme) => css`
  color: ${theme.palette.secondary.light} !important;
`;

const sortableHeaderBase = css`
  cursor: pointer;
`;

const sortableHeaderItem = css`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const sortArrows = css`
  ::after,
  ::bottom {
    display: block;
    line-height: 8px;
    font-weight: 500;
    opacity: 1;
  }

  ::before {
    content: "\\25B2";
    font-size: 10px !important;
  }

  ::after {
    margin-left: -4px;
    content: "\\25BC";
    font-size: 10px !important;
  }
`;

const sortAsc = (theme: Theme) => css`
  ::before {
    color: ${theme.palette.secondary.light};
  }

  ::after {
    color: ${theme.palette.success.dark};
  }
`;

const sortDesc = (theme: Theme) => css`
  ::after {
    color: ${theme.palette.secondary.light};
  }

  ::before {
    color: ${theme.palette.success.dark};
  }
`;

type ItemsTableItem = {
	id: string;
};

type ItemsTableDataFn<T, A extends any[], R> = (
	data: T,
	...additionalData: A
) => R;

export type ItemsTableAttributeProps<T, A extends any[], S> = {
	label: ReactNode;
	colCss?: Interpolation<Theme>;
	sortable?: boolean;
	sortProperty?: string;
	onSortChange?: (sortOrder: SortOrder<S>) => void;
	render: ItemsTableDataFn<T, A, ReactNode>;
	colSpan?: ItemsTableDataFn<T, A, number>;
	hide?: ItemsTableDataFn<T, A, boolean>;
	_data?: T;
	_additionalData?: A;
};

export const ItemsTableAttribute = <
	T extends object = any,
	S = any,
	A extends any[] = []
>(
	props: ItemsTableAttributeProps<T, A, S>
) => {
	const { colSpan, render, hide, _data, _additionalData = [] as any } = props;

	if (!_data || hide?.(_data, ..._additionalData)) {
		return null;
	}

	return (
		<TableCell css={cellStyle} colSpan={colSpan?.(_data, ..._additionalData)}>
			{render(_data, ..._additionalData)}
		</TableCell>
	);
};

export type ItemsTableProps<
	T extends ItemsTableItem,
	S = any,
	A extends any[] = []
> = HTMLAttributes<HTMLDivElement> & {
	data?: T[];
	additionalData?: A;
	loading?: boolean;
	notFound?: boolean;
	notFoundMessage?: string;
	error?: any;
	errorMessage?: string;
	sort?: SortOrder<any>;
	pagination?: Pagination;
	children:
	| ReactElement<ItemsTableAttributeProps<T, A, S>>
	| (
		| ReactElement<ItemsTableAttributeProps<T, A, S>>
		| false
		| undefined
		| null
	)[];
	showRank?: boolean;
	onSortChange?: (property: string | undefined) => void;
	filterMappings?: any;
	filter?: any;
	onFilterChange?: (key: string, value: any) => void;
};

export const ItemsTable = <
	T extends ItemsTableItem,
	S = any,
	A extends any[] = []
>(
	props: ItemsTableProps<T, S, A>
) => {
	const {
		data,
		additionalData,
		loading,
		notFound,
		notFoundMessage = "No items found",
		error,
		errorMessage = "Unexpected error occured while fetching items",
		sort,
		pagination,
		children,
		showRank,
		onSortChange,
		filterMappings,
		filter,
		onFilterChange,
		...restProps
	} = props;

	if (loading) {
		return <Loading />;
	}

	if (notFound) {
		return <NotFound>{notFoundMessage}</NotFound>;
	}

	if (error) {
		return (
			<ErrorMessage
				message={errorMessage}
				details={error.message}
				showReported
			/>
		);
	}

	return (
		<div {...restProps} data-class="table">
			{pagination && <TablePaginationHeader {...pagination} />}
			{filterMappings && filter &&
			Object.entries(filterMappings).map(([property, value], index) => (
				<TableFilter
					property={property}
					filter={value}
					value={filter[property][(value as any).operator]}
					key={`filter-${property}-${index}`}
					onFilterChange={onFilterChange}
				/>
			))}
			<TableContainer>
				<Table css={tableStyle}>
					<colgroup>
						{Children.map(
							children,
							(child) => child && <col css={child.props.colCss} />
						)}
					</colgroup>
					<TableHead>
						<TableRow>
							{showRank ? <TableCell>Rank</TableCell> : <></>}
							{Children.map(children, (child) => {
								if (!child) return null;
								const { label, sortable, sortProperty } = child.props;
								if (sortable !== true)
									return <TableCell css={cellStyle}>{label}</TableCell>;

								const isActive = sort?.property === sortProperty;

								return (
									<TableCell
										css={[cellStyle, sortableHeaderBase]}
										onClick={() => onSortChange && onSortChange(sortProperty)}
									>
										<div css={sortableHeaderItem}>
											{label}
											<div
												css={[
													sortArrows,
													...(isActive
														? [
															activeHeader,
															...(sort?.direction === SortDirection.ASC
																? [sortAsc]
																: sort?.direction === SortDirection.DESC
																	? [sortDesc]
																	: []),
														]
														: []),
												]}
											></div>
										</div>
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map((item, index) => (
							<TableRow key={item.id}>
								{showRank ? (
									<TableCell>{(pagination?.offset || 0) + index + 1}</TableCell>
								) : (
									<></>
								)}
								{Children.map(
									children,
									(child) =>
										child &&
										cloneElement(child, {
											_data: item,
											_additionalData: additionalData,
										})
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{pagination && <TablePagination {...pagination} />}
		</div>
	);
};
