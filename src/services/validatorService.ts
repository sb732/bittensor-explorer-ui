import {
	ValidatorResponse,
	ValidatorStakeHistory,
	ValidatorStakeHistoryPaginatedResponse,
	Validator,
} from "../model/validator";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { extractItems } from "../utils/extractItems";

import { fetchHistorical, fetchIndexer } from "./fetchService";
import { isAddress } from "@polkadot/util-crypto";
import { DataError } from "../utils/error";
import { fetchVerifiedDelegates } from "./delegateService";
import { DelegateInfo } from "../model/delegate";
import { rawAmountToDecimaledString } from "../utils/number";

export type ValidatorsFilter = object;

export type ValidatorsOrder =
	| "AMOUNT_ASC"
	| "AMOUNT_DESC"
	| "NOMINATORS_ASC"
	| "NOMINATORS_DESC"
	| "NOMINATOR_RETURN_PER_K_ASC"
	| "NOMINATOR_RETURN_PER_K_DESC";

export async function getValidator(filter: ValidatorsFilter) {
	const response = await fetchIndexer<{ validators: ResponseItems<Validator> }>(
		`query ($filter: ValidatorFilter) {
			validators(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					owner
					totalDailyReturn
					nominatorReturnPerK
					validatorReturn
					validatorStake
					validatorPermits
					registrations
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
			}
		}`,
		{
			filter,
		}
	);

	const verifiedDelegates = await fetchVerifiedDelegates();
	const data = extractItems(
		response.validators,
		{ limit: 1 },
		addValidatorName,
		verifiedDelegates
	);
	return data.data[0];
}

export async function getValidators(
	order: ValidatorsOrder = "AMOUNT_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchIndexer<{
		validators: ResponseItems<ValidatorResponse>;
	}>(
		`query($first: Int!, $order: [ValidatorsOrderBy!]!) {
			validators(first: $first, orderBy: $order, 
				filter: {
					amount: {
						greaterThanOrEqualTo: "${rawAmountToDecimaledString(1024)}"
					}
				}
			) {
				nodes {
					address
					amount
					amountChange
					id
					nominatorChange
					nominatorReturnPerK
					nominators
					owner
					totalDailyReturn
					validatorStake
					validatorReturn
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			  }
		}`,
		{
			first: 64,
			order,
		}
	);

	const verifiedDelegates = await fetchVerifiedDelegates();
	return extractItems(
		response.validators,
		pagination,
		addValidatorName,
		verifiedDelegates
	);
}

function addValidatorName(
	resp: ValidatorResponse,
	verifiedDelegates: Record<string, DelegateInfo>
): Validator {
	const { registrations, validatorPermits, ...rest } = resp;
	const info = (verifiedDelegates as Record<string, DelegateInfo>)[
		resp.address
	];
	const validator: Validator = {
		...rest,
		registrations: JSON.parse(registrations ?? "[]"),
		validatorPermits: JSON.parse(validatorPermits ?? "[]"),
		name: info?.name,
	};
	return validator;
}

export async function getValidatorStakeHistory(
	address: string[],
	from?: string,
	after?: string,
	limit = 100
): Promise<ValidatorStakeHistoryPaginatedResponse> {
	address.forEach((addr) => {
		if (!isAddress(addr)) {
			throw new DataError("Invalid account address");
		}
	});

	let filter = `address: { in: ${JSON.stringify(address)} }`;
	if (from) {
		filter += `, timestamp: { greaterThan: "${from}" }`;
	}

	const response = await fetchHistorical<{
		validators: ResponseItems<ValidatorStakeHistory>;
	}>(
		`query($after: Cursor, $first: Int!) {
			validators(after: $after, first: $first, filter: { ${filter} }, orderBy: HEIGHT_ASC) {
				nodes {
					address
					amount
					nominators
					rank
					totalDailyReturn
					validatorReturn
					nominatorReturnPerK
					timestamp
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			  }
		}`,
		{
			first: limit,
			after,
		}
	);

	return {
		hasNextPage: response.validators?.pageInfo.hasNextPage,
		endCursor: response.validators?.pageInfo.endCursor,
		data: response.validators?.nodes,
	};
}
