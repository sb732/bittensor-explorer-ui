import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { NETWORK_CONFIG } from "../../config";
import { AccountAddress } from "../AccountAddress";
import { SubnetOwner, SubnetOwnerResponse } from "../../model/subnet";
import { BlockTimestamp } from "../BlockTimestamp";

export type SubnetOwnersTableProps = {
	subnetOwners: SubnetOwnerResponse;
};

const SubnetOwnersTableAttribute = ItemsTableAttribute<SubnetOwner>;

function SubnetOwnersTable(props: SubnetOwnersTableProps) {
	const { subnetOwners } = props;
	const { prefix } = NETWORK_CONFIG;

	return (
		<ItemsTable
			data={subnetOwners.data}
			loading={subnetOwners.loading}
			notFoundMessage="No subnet owners found"
			error={subnetOwners.error}
			data-test="subnet-owners-table"
		>
			<SubnetOwnersTableAttribute
				label="Block"
				render={(subnet) => <>{subnet.height}</>}
			/>
			<SubnetOwnersTableAttribute
				label="Created At"
				render={(subnet) => <BlockTimestamp blockHeight={subnet.height} />}
			/>
			<SubnetOwnersTableAttribute
				label="Owner"
				render={(subnet) => (
					<AccountAddress
						address={subnet.owner}
						prefix={prefix}
						link
						copyToClipboard="small"
					/>
				)}
			/>
		</ItemsTable>
	);
}

export default SubnetOwnersTable;
