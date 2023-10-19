import { isAddress } from "@polkadot/util-crypto";

import { Account } from "../model/account";
import { addRuntimeSpec } from "../utils/addRuntimeSpec";
import { DataError } from "../utils/error";
import { decodeAddress } from "../utils/formatAddress";
import {
	AccountStats,
	AccountStatsPaginatedResponse,
} from "../model/accountStats";
import { ResponseItems } from "../model/itemsConnection";
import { fetchHistorical } from "./fetchService";

export async function getAccount(
	address: string
): Promise<Account | undefined> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	// if the address is encoded, decode it
	const decodedAddress = decodeAddress(address);

	if (decodedAddress) {
		address = decodedAddress;
	}

	const data: Omit<Account, "runtimeSpec"> = {
		id: address,
		address,
		identity: null,
	};

	// data.identity = await getAccountIdentity(network, address);

	const account = await addRuntimeSpec(data, () => "latest");

	return account;
}

export async function getAccountStats(
	offset: number,
	limit = 100
): Promise<AccountStatsPaginatedResponse> {
	const response = await fetchHistorical<{
		accountStats: ResponseItems<AccountStats>;
	}>(
		`query($first: Int!, $offset: Int!) {
			accountStats(first: $first, offset: $offset, orderBy: HEIGHT_ASC) {
				pageInfo {
					hasNextPage
				}
				nodes {
				  height
				  active
				  holders
				  total
				  activeHolders
				  id
				  timestamp
				}
			  }
		}`,
		{
			first: limit,
			offset,
		}
	);

	return {
		hasNextPage: response.accountStats?.pageInfo.hasNextPage,
		data: response.accountStats?.nodes,
	};
}
