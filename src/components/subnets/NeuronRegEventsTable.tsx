/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { PaginatedResource } from "../../model/paginatedResource";
import { SortOrder } from "../../model/sortOrder";
import { SortDirection } from "../../model/sortDirection";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { NeuronRegEventsOrder } from "../../services/subnetsService";
import { NeuronRegEvent } from "../../model/subnet";
import { css } from "@emotion/react";
import { Time } from "../Time";

const whiteText = css`
	color: white;
`;

export type NeuronRegEventsTableProps = {
	regEvents: PaginatedResource<NeuronRegEvent>;
	initialSortOrder?: string;
	onSortChange?: (orderBy: NeuronRegEventsOrder) => void;
	initialSort?: string;
};

const NeuronRegEventsTableAttribute = ItemsTableAttribute<NeuronRegEvent>;

const orderMappings = {
	uid: {
		[SortDirection.ASC]: "UID_ASC",
		[SortDirection.DESC]: "UID_DESC",
	},
	hotkey: {
		[SortDirection.ASC]: "HOTKEY_ASC",
		[SortDirection.DESC]: "HOTKEY_DESC",
	},
	coldkey: {
		[SortDirection.ASC]: "COLDKEY_ASC",
		[SortDirection.DESC]: "COLDKEY_DESC",
	},
	date: {
		[SortDirection.ASC]: "TIMESTAMP_ASC",
		[SortDirection.DESC]: "TIMESTAMP_DESC",
	},
	height: {
		[SortDirection.ASC]: "HEIGHT_ASC",
		[SortDirection.DESC]: "HEIGHT_DESC",
	},
};

function NeuronRegEventsTable(props: NeuronRegEventsTableProps) {
	const { regEvents } = props;

	const { initialSort, onSortChange } = props;
	const [sort, setSort] = useState<SortOrder<string>>();

	useEffect(() => {
		Object.entries(orderMappings).forEach(([property, value]) => {
			Object.entries(value).forEach(([dir, orderKey]) => {
				console.log([dir, orderKey, initialSort]);
				if (orderKey === initialSort) {
					setSort({
						property,
						direction: dir === "1" ? SortDirection.ASC : SortDirection.DESC,
					});
				}
			});
		});
	}, [initialSort]);

	const handleSortChange = (property?: string) => {
		if (!property) return;
		if (property === sort?.property) {
			setSort({
				...sort,
				direction:
					sort.direction === SortDirection.ASC
						? SortDirection.DESC
						: SortDirection.ASC,
			});
		} else {
			setSort({
				property,
				direction: SortDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!onSortChange || !sort?.property || sort.direction === undefined)
			return;
		onSortChange((orderMappings as any)[sort.property][sort.direction]);
	}, [JSON.stringify(sort)]);

	return (
		<ItemsTable
			data={regEvents.data}
			loading={regEvents.loading}
			notFound={regEvents.notFound}
			notFoundMessage="No Reg Events"
			error={regEvents.error}
			pagination={regEvents.pagination}
			data-test="reg-events-table"
			sort={sort}
			onSortChange={handleSortChange}
		>
			<NeuronRegEventsTableAttribute
				label="uid"
				sortable
				render={(data) => (
					<Link to={`https://taostats.io/hotkey/?hkey=${data.hotkey}`}>
						{data.uid}
					</Link>
				)}
				sortProperty="uid"
			/>
			<NeuronRegEventsTableAttribute
				label="hotkey"
				sortable
				render={(data) => <span css={whiteText}>{data.hotkey}</span>}
				sortProperty="hotkey"
			/>
			<NeuronRegEventsTableAttribute
				label="coldkey"
				sortable
				render={(data) => <span css={whiteText}>{data.coldkey}</span>}
				sortProperty="coldkey"
			/>
			<NeuronRegEventsTableAttribute
				label="time(utc)"
				sortable
				render={(data) => (
					<span css={whiteText}>
						<Time time={data.timestamp} />
					</span>
				)}
				sortProperty="date"
			/>
			<NeuronRegEventsTableAttribute
				label="block"
				sortable
				render={(data) => (
					<Link to={`/block/${data.height}`}>{data.height}</Link>
				)}
				sortProperty="height"
			/>
		</ItemsTable>
	);
}

export default NeuronRegEventsTable;
