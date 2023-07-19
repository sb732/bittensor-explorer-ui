/** @jsxImportSource @emotion/react */
import { FaDiscord } from "react-icons/fa";
import { Twitter } from "@mui/icons-material";
import { alpha } from "@mui/material";
import { css, Theme } from "@emotion/react";
import { HTMLAttributes } from "react";

const footerStyle = css`
	box-sizing: border-box;
	width: 100%;
	padding: 24px;
	padding-top: 48px;
	padding-bottom: 64px;
`;

const contentStyle = (theme: Theme) => css`
	display: flex;
	box-sizing: border-box;
	justify-content: space-between;
	margin: 0 auto;
	padding: 0 16px;
	align-items: center;
	gap: 52px;

	width: 100%;

	z-index: 100;

	font-size: 15px;
	color: ${theme.palette.primary.light};

	a {
		color: inherit;
		text-decoration: none;
	}

	${theme.breakpoints.down("md")} {
		flex-direction: column-reverse;
		gap: 16px;
	}
`;

const creditsStyle = css`
	display: flex;
	align-items: center;

	> div {
		text-align: center;
	}

	a {
		font-weight: 600;
	}
`;

const separatorStyle = css`
	display: inline-block;
	width: 1px;
	height: 10px;
	background-color: currentColor;
	margin: 0 16px;
	margin-top: 2px;
	opacity: .75;
`;

const linksStyle = css`
	display: flex;
	padding: 0 8px;
	width: fit-content;
	align-items: center;
	gap: 2rem;
	z-index: 10;
`;

const iconStyle = (theme: Theme) => css`
	display: block;
	font-size: 1.25em;
	color: ${alpha(theme.palette.primary.light, .8)};
`;

export const Footer = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div css={footerStyle} {...props}>
			<div css={contentStyle}>
				<div css={creditsStyle}>
					<div>Created by <a href="https://taostats.io">TaoStats</a></div>
					<div css={separatorStyle}></div>
					<div>Built on <a href="https://bittensor.com">Bittensor</a></div>
				</div>
				<div css={linksStyle}>
					<a href="https://twitter.com/taostats">
						<Twitter css={iconStyle} />
					</a>
					<a href="https://discord.com/channels/1086368192521318472/1086369375411507290">
						<FaDiscord css={iconStyle} />
					</a>
				</div>
			</div>
		</div>
	);
};
