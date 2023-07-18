/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Event } from "../../model/event";
import { PaginatedResource } from "../../model/paginatedResource";

import { getEventMetadataByName } from "../../utils/queryMetadata";

import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

const parametersColCss = (showExtrinsic?: boolean) => css`
	width: ${showExtrinsic ? "40%" : "60%"};
`;

export type EventsTableProps = {
	network: string;
	events: PaginatedResource<Event>;
	showExtrinsic?: boolean;
};

const EventsItemsTableAttribute = ItemsTableAttribute<Event>;

function EventsTable(props: EventsTableProps) {
	const { network, events, showExtrinsic } = props;

	return (
		<ItemsTable
			data={events.data}
			loading={events.loading}
			notFound={events.notFound}
			notFoundMessage="No events found"
			error={events.error}
			pagination={events.pagination}
			data-test="events-table"
		>
			<EventsItemsTableAttribute
				label="ID"
				render={(event) => (
					<Link to={`/event/${event.id}`}>
						{event.id}
					</Link>
				)}
			/>
			<EventsItemsTableAttribute
				label="Name"
				render={(event) =>
					<ButtonLink
						to={`/search?query=${event.palletName}.${event.eventName}`}
						size="small"
						color="secondary"
					>
						{event.palletName}.{event.eventName}
					</ButtonLink>
				}
			/>
			{showExtrinsic && (
				<EventsItemsTableAttribute
					label="Extrinsic"
					render={(event) => event.extrinsicId && (
						<Link to={`/extrinsic/${event.extrinsicId}`}>
							{event.extrinsicId}
						</Link>
					)}
				/>
			)}
			<EventsItemsTableAttribute
				label="Parameters"
				colCss={parametersColCss(showExtrinsic)}
				render={(event) => {
					if (!event.args) {
						return null;
					}

					return (
						<DataViewer
							network={network}
							data={event.args}
							metadata={getEventMetadataByName(
								event.runtimeSpec.metadata,
								event.palletName,
								event.eventName
							)?.args}
							runtimeSpec={event.runtimeSpec}
							copyToClipboard
						/>
					);
				}}
			/>
		</ItemsTable>
	);
}

export default EventsTable;
