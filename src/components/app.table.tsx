import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import CreateModal from "./create.modal";

interface Iprops {
	users: IUser[];
}

function AppTable(props: Iprops) {
	const { users } = props;

	return (
		<>
			<div className="mt-3 mb-1" style={{ display: "flex", justifyContent: "space-between" }}>
				<h3 style={{ textTransform: "uppercase" }}>Table list of Users</h3>
				<CreateModal></CreateModal>
			</div>

			<Table className="mt-3" striped bordered hover size="sm">
				<thead>
					<tr>
						<th>No</th>
						<th>Name</th>
						<th>Company</th>
						<th>Email</th>
						<th>Phone</th>
					</tr>
				</thead>
				<tbody>
					{users?.map((user) => {
						return (
							<tr key={user.id}>
								<td>{user.id}</td>
								<td>{user.name}</td>
								<td>{user.company}</td>
								<td>{user.email}</td>

								<td>
									<Button variant="primary">View</Button>
									<Button variant="warning" className="mx-2">
										Edit
									</Button>
									<Button variant="danger">Delete</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</>
	);
}

export default AppTable;
