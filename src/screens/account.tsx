/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import { Card, CardHeader, CardRow } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import TransfersTable from "../components/transfers/TransfersTable";

import { useAccount } from "../hooks/useAccount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useTransfers } from "../hooks/useTransfers";
import { AccountInfoTable } from "../components/account/AccountInfoTable";
import { AccountPortfolio } from "../components/account/AccountPortfolio";
import { useTaoPrice } from "../hooks/useTaoPrice";
import { useBalance } from "../hooks/useBalance";
import { StatItem } from "../components/network/StatItem";
import { formatCurrency, rawAmountToDecimal } from "../utils/number";
import { useDelegateBalances } from "../hooks/useDelegateBalances";
import { TransfersOrder } from "../services/transfersService";
import { DelegatesOrder } from "../services/delegateService";
import { useDelegates } from "../hooks/useDelegates";
import DelegatesTable from "../components/delegates/DelegatesTable";
import { MIN_DELEGATION_AMOUNT } from "../config";
import { useAppStats } from "../contexts";
import {
	useAccountBalanceHistory,
	useAccountDelegateHistory,
} from "../hooks/useAccountHistory";
import { AccounBalanceHistoryChart } from "../components/account/AccounBalanceHistoryChart";
import { AccounDelegateHistoryChart } from "../components/account/AccounDelegateHistoryChart";

const accountInfoStyle = css`
  display: flex;
  flex-direction: column;
`;

const accountLabelAddress = css`
  opacity: 0.5;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const portfolioStyle = (theme: Theme) => css`
  flex: 0 0 auto;
  width: 400px;

  ${theme.breakpoints.down("lg")} {
    width: auto;
  }
`;

const accountHeader = (theme: Theme) => css`
  display: flex;
  gap: 4px;
  align-items: center;
  word-break: keep-all;
  color: ${theme.palette.text.primary};
`;

const infoSection = css`
  display: flex;
  @media only screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const summary = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const accountTitle = css`
  display: block;
  opacity: 0.8;
  width: 144px;
  font-size: 12px;
`;

export type AccountPageParams = {
	address: string;
};

export const AccountPage = () => {
	const { address } = useParams() as AccountPageParams;
	const balance = useBalance({ address: { equalTo: address } });
	const { state } = useAppStats();

	const blockHeight =
    Math.floor(Number(state.chainStats?.blocksFinalized ?? 0) / 1000) * 1000;

	const account = useAccount(address);
	const extrinsics = useExtrinsics(
		{ signer: { equalTo: address } },
		"BLOCK_HEIGHT_DESC"
	);
	const transfers = useTransfers({
		or: [{ from: { equalTo: address } }, { to: { equalTo: address } }],
	});
	const delegateBalances = useDelegateBalances(
		{
			account: { equalTo: address },
			amount: { greaterThan: MIN_DELEGATION_AMOUNT },
			updatedAt: { greaterThan: blockHeight > 1000 ? blockHeight - 1000 : 0 },
		},
		"AMOUNT_DESC"
	);

	const delegatesInitialOrder: TransfersOrder = "BLOCK_NUMBER_DESC";
	const [delegateSort, setDelegateSort] = useState<DelegatesOrder>(
		delegatesInitialOrder
	);
	const delegates = useDelegates(
		{
			and: [
				{ account: { equalTo: address } },
				{ amount: { greaterThan: MIN_DELEGATION_AMOUNT } },
			],
		},
		delegateSort
	);

	const delegated = `${formatCurrency(
		rawAmountToDecimal((balance?.data?.staked || 0).toString()),
		"USD",
		{ decimalPlaces: 2 }
	)} 𝞃`;

	const free = `${formatCurrency(
		rawAmountToDecimal((balance?.data?.free || 0).toString()),
		"USD",
		{ decimalPlaces: 2 }
	)} 𝞃`;

	const taoPrice = useTaoPrice();

	const accountBalanceHistory = useAccountBalanceHistory(address);
	const accountDelegateHistory = useAccountDelegateHistory(address);

	useDOMEventTrigger(
		"data-loaded",
		!account.loading &&
      !extrinsics.loading &&
      !transfers.loading &&
      !taoPrice.loading &&
      !delegates.loading &&
      !delegateBalances.loading &&
      !accountBalanceHistory.loading &&
      !accountDelegateHistory.loading
	);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 12 * 1000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	useEffect(() => {
		if (transfers.pagination.offset === 0) {
			const interval = setInterval(transfers.refetch, 12 * 1000);
			return () => clearInterval(interval);
		}
	}, [transfers]);

	useEffect(() => {
		if (delegates.pagination.offset === 0) {
			const interval = setInterval(delegates.refetch, 12 * 1000);
			return () => clearInterval(interval);
		}
	}, [delegates]);

	useEffect(() => {
		if (balance.refetch) {
			const interval = setInterval(balance.refetch, 12 * 1000);
			return () => clearInterval(interval);
		}
	}, [balance]);

	const { hash: tab } = useLocation();
	const tabRef = useRef(null);
	useEffect(() => {
		if (tab) {
			document.getElementById(tab)?.scrollIntoView();
			window.scrollBy(0, -175);
		} else {
			window.scrollTo(0, 0);
		}
	}, [tab]);

	return (
		<>
			<CardRow css={infoSection}>
				<Card css={accountInfoStyle} data-test="account-info">
					<CardHeader css={accountHeader}>
						<div css={accountTitle}>Account</div>
						{/* {(account.loading || account.data) && (
							<AccountAvatar address={address} size={32} css={avatarStyle} />
						)} */}
						<div css={accountLabelAddress}>{address}</div>
					</CardHeader>
					<AccountInfoTable
						info={{
							account,
							balance,
							delegates: delegateBalances,
							price: taoPrice.data?.toNumber(),
						}}
					/>
				</Card>
				<Card css={portfolioStyle} data-test="account-portfolio">
					<div css={summary}>
						<StatItem title="Delegated" value={delegated} />
						<StatItem title="Free" value={free} />
					</div>
					<AccountPortfolio balance={balance} taoPrice={taoPrice} />
				</Card>
			</CardRow>
			{account.data && (
				<Card data-test="account-historical-items">
					<div ref={tabRef}>
						<TabbedContent>
							<TabPane
								label="Balance"
								loading={accountBalanceHistory.loading}
								error={!!accountBalanceHistory.error}
								value="balance"
							>
								<AccounBalanceHistoryChart
									balanceHistory={accountBalanceHistory}
								/>
							</TabPane>
							<TabPane
								label="Delegation"
								loading={accountDelegateHistory.loading}
								error={!!accountDelegateHistory.error}
								value="delegation"
							>
								<AccounDelegateHistoryChart
									delegateHistory={accountDelegateHistory}
								/>
							</TabPane>
						</TabbedContent>
					</div>
				</Card>
			)}
			{account.data && (
				<Card data-test="account-related-items">
					<div ref={tabRef}>
						<TabbedContent>
							<TabPane
								label="Extrinsics"
								count={extrinsics.pagination.totalCount}
								loading={extrinsics.loading}
								error={extrinsics.error}
								value="extrinsics"
							>
								<ExtrinsicsTable extrinsics={extrinsics} showTime />
							</TabPane>

							<TabPane
								label="Transfers"
								count={transfers.pagination.totalCount}
								loading={transfers.loading}
								error={transfers.error}
								value="transfers"
							>
								<TransfersTable
									transfers={transfers}
									showTime
									direction={{ show: true, source: address }}
								/>
							</TabPane>

							<TabPane
								label="Delegation"
								count={delegates.pagination.totalCount}
								loading={delegates.loading}
								error={delegates.error}
								value="delegation"
							>
								<DelegatesTable
									delegates={delegates}
									showTime
									onSortChange={(sortKey: DelegatesOrder) =>
										setDelegateSort(sortKey)
									}
									initialSort={delegatesInitialOrder}
								/>
							</TabPane>
						</TabbedContent>
					</div>
				</Card>
			)}
		</>
	);
};
