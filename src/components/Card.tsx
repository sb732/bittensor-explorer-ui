/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css, Theme } from "@emotion/react";

const cardStyle = (theme: Theme) => css`
	position: relative;
	border-radius: 8px;
	padding: 24px;
	background-color: white;
	margin: 16px 0;

	::after {
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 8px;
		box-shadow: 0px 0px 64px rgba(98, 151, 163, 0.13);
		z-index: -1;
	}

	${theme.breakpoints.up("md")} {
		padding: 48px;
	}
`;

const cardHeaderStyle = css`
	display: block;
	padding-bottom: 48px;
	align-items: center;

	font-weight: 700;
	font-size: 24px;
	line-height: 32px;

	word-break: break-all;

	[data-class=copy-button] {
		vertical-align: text-bottom;
		margin: 6px 0;
		margin-left: 16px;
	}
`;

const cardRowStyle = (theme: Theme) => css`
	display: flex;
	flex-direction: row;
	align-items: stretch;
	gap: 16px;
	margin: 16px 0;

	> * {
		flex: 1 1 auto;
	}

	> [data-class=card] {
		margin: 0;
	}

	${theme.breakpoints.down("lg")} {
		flex-direction: column;
	}
`;

export const Card = (props: HTMLAttributes<HTMLDivElement>) => {
	return <div css={cardStyle} data-class="card" {...props} />;
};

export const CardHeader = (props: HTMLAttributes<HTMLDivElement>) => {
	return <div css={cardHeaderStyle} data-class="card-header" {...props} />;
};

export const CardRow = (props: HTMLAttributes<HTMLDivElement>) => {
	return <div css={cardRowStyle} data-class="card-row" {...props} />;
};
