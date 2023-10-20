/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { nFormatter, rawAmountToDecimal } from "../../utils/number";
import {
	AccountBalanceHistory,
	AccountBalanceHistoryResponse,
} from "../../model/accountBalanceHistory";

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export type AccounBalanceHistoryChartProps = {
	balanceHistory: AccountBalanceHistoryResponse;
};

export const AccounBalanceHistoryChart = (
	props: AccounBalanceHistoryChartProps
) => {
	const theme = useTheme();

	const { balanceHistory } = props;

	const loading = balanceHistory.loading;
	const timestamps = useMemo(() => {
		if (!balanceHistory.data) return [];
		const resp = balanceHistory.data.map(
			(x: AccountBalanceHistory) => x.timestamp
		);
		return resp;
	}, [balanceHistory]);
	const maxBalance = useMemo(() => {
		if (!balanceHistory.data) return 0;
		const resp = balanceHistory.data.reduce(
			(prev: number, cur: AccountBalanceHistory) => {
				const now = rawAmountToDecimal(cur.balanceTotal.toString()).toNumber();
				return now > prev ? now : prev;
			},
			0
		);
		return resp;
	}, [balanceHistory]);
	const staked = useMemo(() => {
		if (!balanceHistory.data) return [];
		return balanceHistory.data.map((x: AccountBalanceHistory) =>
			rawAmountToDecimal(x.balanceStaked.toString()).toNumber()
		);
	}, [balanceHistory]);
	const free = useMemo(() => {
		if (!balanceHistory.data) return [];
		return balanceHistory.data.map((x: AccountBalanceHistory) =>
			rawAmountToDecimal(x.balanceFree.toString()).toNumber()
		);
	}, [balanceHistory]);
	const total = useMemo(() => {
		if (!balanceHistory.data) return [];
		return balanceHistory.data.map((x: AccountBalanceHistory) =>
			rawAmountToDecimal(x.balanceTotal.toString()).toNumber()
		);
	}, [balanceHistory]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Free",
					type: "area",
					data: free,
				},
				{
					name: "Delegated",
					type: "area",
					data: staked,
				},
				{
					name: "Total",
					type: "area",
					data: total,
				},
			]}
			options={{
				chart: {
					toolbar: {
						show: true,
						offsetX: 0,
						offsetY: 0,
						autoSelected: "pan",
						tools: {
							selection: true,
							zoom: true,
							zoomin: true,
							zoomout: true,
							pan: true,
						},
					},
					zoom: {
						enabled: true,
					},
				},
				colors: [
					theme.palette.error.main,
					theme.palette.neutral.main,
					theme.palette.success.main,
				],
				dataLabels: {
					enabled: false,
				},
				fill: {
					type: "gradient",
					gradient: {
						shade: "dark",
						shadeIntensity: 1,
						inverseColors: false,
						type: "vertical",
						opacityFrom: 0.6,
						opacityTo: 0.1,
						stops: [0, 90, 100],
					},
				},
				grid: {
					show: false,
				},
				labels: timestamps,
				legend: {
					show: true,
					position: "top",
					horizontalAlign: "left",
				},
				markers: {
					size: 0,
				},
				noData: {
					text: "Loading ...",
					align: "center",
					verticalAlign: "middle",
					offsetX: 0,
					offsetY: 0,
					style: {
						color: "#FFFFFF",
					},
				},
				responsive: [
					{
						breakpoint: 767,
						options: {
							chart: {
								height: 320,
							},
						},
					},
					{
						breakpoint: 599,
						options: {
							chart: {
								height: 270,
							},
						},
					},
				],
				stroke: {
					width: 1,
				},
				tooltip: {
					theme: "dark",
					shared: true,
					intersect: false,
					x: {
						format: "dd MMM yy",
					},
					y: {
						formatter: (val: number) => nFormatter(val, 2).toString(),
					},
				},
				xaxis: {
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					labels: {
						style: {
							fontSize: "11px",
							colors: "#7F7F7F",
						},
					},
					type: "datetime",
				},
				yaxis: {
					opposite: true,
					labels: {
						style: {
							colors: "#a8a8a8",
						},
						formatter: (val: number) => nFormatter(val, 2).toString(),
					},
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					min: 0,
					max: maxBalance,
				},
			}}
		/>
	);
};
