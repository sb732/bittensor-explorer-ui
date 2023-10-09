/** @jsxImportSource @emotion/react */
import { css } from "@mui/material";

import { Theme } from "@emotion/react";

const filterStyle = () => css`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding: 0 0 0 20px;
  font-size: 14px;
`;

const filterLabelStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  margin-right: 5px;
`;

const filterItemStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.main};
  cursor: pointer;
`;

const filterItemSelectedStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.light};
  cursor: pointer;
`;

type TableFilterProps = {
	property: string;
	filter: any;
	value: any;
	onFilterChange?: (key: string, value: any) => void;
};

export function TableFilter(props: TableFilterProps) {
	const { property, filter, value, onFilterChange } = props;

	return (
		<div css={filterStyle}>
			<label css={filterLabelStyle}>{filter.key}</label>
			{filter.values.map((breakpoint: any, index: number) => (
				<div
					css={breakpoint === value ? filterItemSelectedStyle : filterItemStyle}
					key={index}
					onClick={() => onFilterChange && onFilterChange(property, breakpoint)}
				>
					{filter.labels[index]}
				</div>
			))}
		</div>
	);
}
