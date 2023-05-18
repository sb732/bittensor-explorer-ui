/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useMemo } from "react";
import { lighten, useMediaQuery } from "@mui/material";
import { css, useTheme } from "@emotion/react";
import { CallbackDataParams } from "echarts/types/dist/shared";

import { formatNumber } from "../../utils/number";
import { Network } from "../../model/network";
import { Stats } from "../../model/stats";

import { PieChart, PieChartOptions } from "../PieChart";

export const chartStyle = css`
	.ECharts-tooltip {
		[data-class=title] {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 8px;
			font-weight: 600;
			font-size: 15px;
		}

		[data-class=value] {
			font-size: 15px;
		}
	}
`;

export type NetworkTokenDistributionChartProps = HTMLAttributes<HTMLDivElement> & {
	stats: Stats;
	network: Network;
}

export const NetworkTokenDistributionChart = (props: NetworkTokenDistributionChartProps) => {
	const { stats, network, ...divProps } = props;

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const totalData = useMemo(() => {
		if (!stats) {
			return [];
		}

		return [
			{
				name: "Circulating",
				value: stats.circulatingValueTotal,
				itemStyle: {
					color: network.color || theme.palette.primary.main,
				}
			},
			{
				name: "Staked",
				value: stats.stakingTotalStake,
				itemStyle: {
					color: lighten(network.color || theme.palette.primary.main, .5),
				},
			},
			{
				name: "Other",
				value: stats.balancesTotalIssuance - stats.circulatingValueTotal - stats.stakingTotalStake,
				itemStyle: {
					color: "lightgray"
				},
			}
		].filter(it => it.value > 0);
	}, [stats]);


	const options = useMemo<PieChartOptions>(() => {
		return {
			title: {
				text: network.symbol,
				left: 110,
				top: 98,
				textAlign: "center",
				textStyle: {
					fontWeight: 400,
					fontSize: 22,
					fontFamily: "Open Sans"
				}
			},
			tooltip: {
				formatter: (params) => {
					const { name, value, percent } = params as CallbackDataParams;

					console.log("PARAMS: ", params);

					return `
						<div data-class="title">${name}</div>
						<div data-class="value">${formatNumber(value as number)} (${percent}%)</div>
					`;
				}
			},
			legend: {
				formatter: (name) => {
					const item = totalData.find(it => it.name === name);
					const value = item!.value;
					const percent = (value * 100 / stats.balancesTotalIssuance).toFixed(2);
					return `${name}\n${formatNumber(value, {compact: true})} (${percent}%)`;
				},
				textStyle: {
					width: 115,//85,
					overflow: "truncate",
					lineHeight: 16
				},
				itemHeight: 32,
				itemWidth: 14,
				orient: "vertical",
				top: isSmallScreen ? "auto" : "center",
				left: isSmallScreen ? "center" : 265,
				bottom: isSmallScreen ? 0 : "auto",
				height: isSmallScreen ? "auto" : 140,
			},
			series: {
				radius: [60, 100],
				center: isSmallScreen
					? ["center", 116]
					: [116, "center"],
				data: [
					...totalData,
				]
			},
		};

	}, [totalData, isSmallScreen]);

	return (
		<PieChart
			options={options}
			css={[chartStyle, {
				width: isSmallScreen ? 230 : 400,
				height: isSmallScreen
					? (
						230 // pie chart height
						+ 32 // margin
						+ totalData.length * 42 // legend height
					)
					: 230
			}]}
			data-test="network-token-distribution-chart"
			{...divProps}
		/>
	);
};
