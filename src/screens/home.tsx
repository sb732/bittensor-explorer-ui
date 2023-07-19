/** @jsxImportSource @emotion/react */
import { css, Theme } from "@emotion/react";

import Logo from "../assets/logo.png";
import Background from "../assets/main-screen-bgr.svg";

import SearchInput from "../components/SearchInput";
import { Footer } from "../components/Footer";
import { Card } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { hasSupport } from "../services/networksService";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";
import { useUsdRates } from "../hooks/useUsdRates";
import { useRootLoaderData } from "../hooks/useRootLoaderData";

const containerStyle = (theme: Theme) => css`
  --content-min-height: 800px;

  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${theme.breakpoints.up("sm")} {
    --content-min-height: 900px;
  }

  ${theme.breakpoints.up("md")} {
    --content-min-height: 1000px;
  }

  ${theme.breakpoints.up("lg")} {
    --content-min-height: 1100px;
  }

  ${theme.breakpoints.up("xl")} {
    --content-min-height: 1200px;
  }
`;

const contentStyle = css`
  position: relative;
  flex: 1 1 auto;
  min-height: var(--content-min-height);
`;

const contentInner = css`
  box-sizing: border-box;
  max-width: 1500px;
  margin: 0 auto;
  margin-top: 64px;
  margin-bottom: 48px;
  padding: 0 16px;
`;

const backgroundStyle = css`
  position: absolute;
  top: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  z-index: -1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--content-min-height);
    background-color: white;
    background-position: center bottom;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-image: url(${Background});
  }

  &::after {
    content: "";
    position: absolute;
    top: var(--content-min-height);
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #9af0f7;
  }
`;

const logoContainerStyle = css`
`;

const logoStyle = css`
  width: 160px;
  margin: 0px auto;
  display: block;
  max-width: 100%;
`;

const subtitleStyle = (theme: Theme) => css`
  position: relative;
  margin: 0;
  margin-bottom: 4rem;
  text-align: center;
  color: ${theme.palette.text.primary};
`;

const searchBoxStyle = css`
  display: flex;
  max-width: 1000px;
  min-width: 45%;
  text-align: center;
  justify-content: center;
`;

const searchInputStyle = (theme: Theme) => css`
  flex: 1 1 auto;

  .MuiInputBase-root {
    .MuiInputBase-input,
    .MuiSelect-select {
      padding: 16px 24px;
    }
  }

  ${theme.breakpoints.up("md")} {
    .MuiButton-root {
      padding-left: 52px;
      padding-right: 52px;
    }
  }
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem 4rem;
  background-color: #181818;
`;

const footerStyle = css`
  flex: 0 0 auto;

  background: #181818;

  > div {
    max-width: 1000px;
  }
`;

export const HomePage = () => {
	const { network } = useRootLoaderData();

	const extrinsics = useExtrinsicsWithoutTotalCount(
		network.name,
		undefined,
		"id_DESC"
	);
	const blocks = useBlocks(network.name, undefined, "id_DESC");
	const transfers = useTransfers(network.name, undefined, "id_DESC");
	const topHolders = useBalances(network.name, undefined, "total_DESC");

	const usdRates = useUsdRates();

	return (
		<div css={containerStyle}>
			<div css={backgroundStyle} data-test="background" />
			<div css={ headerStyle }>
				<div css={logoContainerStyle}>
					<img src={Logo} css={logoStyle} />
				</div>
				<div css={searchBoxStyle}>
					<SearchInput
						css={searchInputStyle}
						defaultNetwork={"polkadot"}
						persistNetwork
					/>
				</div>

			</div>
			<div css={contentStyle}>
				<div css={contentInner}>
					<h1 css={subtitleStyle}>Block explorer for Bittensor ecosystem</h1>
					<Card>
						<TabbedContent>
							<TabPane
								label="Extrinsics"
								count={extrinsics.pagination.totalCount}
								loading={extrinsics.loading}
								error={extrinsics.error}
								value="extrinsics"
							>
								<ExtrinsicsTable
									network={network.name}
									extrinsics={extrinsics}
									showAccount
									showTime
								/>
							</TabPane>
							<TabPane
								label="Blocks"
								count={blocks.pagination.totalCount}
								loading={blocks.loading}
								error={blocks.error}
								value="blocks"
							>
								<BlocksTable
									network={network.name}
									blocks={blocks}
									showValidator
									showTime
								/>
							</TabPane>

							{hasSupport(network.name, "main-squid") && (
								<TabPane
									label="Transfers"
									count={transfers.pagination.totalCount}
									loading={transfers.loading}
									error={transfers.error}
									value="transfers"
								>
									<TransfersTable
										network={network.name}
										transfers={transfers}
										showTime
									/>
								</TabPane>
							)}
							{hasSupport(network.name, "balances-squid") && (
								<TabPane
									label="Top holders"
									count={topHolders.pagination.totalCount}
									loading={topHolders.loading}
									error={topHolders.error}
									value="top-holders"
								>
									<BalancesTable
										network={network.name}
										balances={topHolders}
										usdRates={usdRates}
									/>
								</TabPane>
							)}
						</TabbedContent>
					</Card>
				</div>
			
			</div>
			<Footer css={footerStyle} />
		</div>
	);
};
