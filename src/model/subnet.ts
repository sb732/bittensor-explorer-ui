import { DataError } from "../utils/error";

export type Subnet = {
	id: string;
	netUid: number;
	name?: string;
	owner: string;
	extrinsicId: number;
	emission: number;
	recycled24H: bigint;
	recycledAtCreation: bigint;
	recycledByOwner: bigint;
	recycledLifetime: bigint;
	regCost: bigint;
	timestamp: string;
};

export type SubnetHistory = {
	netUid: bigint;
	height: bigint;
	timestamp: string;
	emission: bigint;
	recycled: bigint;
	recycled24H: bigint;
};

export type SubnetHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: SubnetHistory[];
};

export type SubnetHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: SubnetHistory[];
	ids: number[];
};

export type SubnetRegCostHistory = {
	height: bigint;
	timestamp: string;
	regCost: bigint;
};

export type SubnetRegCostHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: SubnetRegCostHistory[];
};

export type SubnetRegCostHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: SubnetRegCostHistory[];
};

export type SubnetOwner = {
	id: string;
	netid: bigint;
	height: bigint;
	owner: string;
};

export type SubnetOwnerPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: SubnetOwner[];
};

export type SubnetOwnerResponse = {
	loading: boolean;
	error?: DataError;
	data: SubnetOwner[];
	ids: number[];
};

export type SubnetStat = {
	height: bigint;
	regCost: bigint;
	timestamp: string;
};

export type NeuronRegCostHistory = {
	height: bigint;
	timestamp: string;
	regCost: bigint;
	netUid: number;
};

export type NeuronRegCostHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: NeuronRegCostHistory[];
};

export type NeuronRegCostHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: NeuronRegCostHistory[];
};
