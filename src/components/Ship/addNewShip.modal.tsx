import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewShipModal = ({
	accessToken,
	onSuccess,
}: {
	accessToken: string;
	onSuccess: () => void;
}) => {
	const [show, setShow] = useState(false);

	const handleClose = () => {
		setShow(false);
		setShipCode("");
		setShipName("");
		setManufacturer("");
		setDescription("");
	};

	const handleShow = () => setShow(true);

	const [shipCode, setShipCode] = useState<string>("");
	const [shipName, setShipName] = useState<string>("");
	const [manufacturer, setManufacturer] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// Ham khi nhan nut "Create"
	const handleSubmitForm = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!shipCode) formErrors.shipCode = "Ship code is required!";
		if (!shipName) formErrors.shipName = "Ship name is required!";
		if (!manufacturer) formErrors.manufacturer = "Manufacturer is required!";
		if (!description) formErrors.description = "Description is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const ftpServerDTO = {
				ship_code: shipCode,
				ship_name: shipName,
				ship_manufacturer: manufacturer,
				ship_status: true,
				ship_description: description,
			};

			try {
				const response = await axios.post(
					"http://localhost:3001/ships/addNewShip",
					ftpServerDTO,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Thêm hãng đối tác thành công!");
					setShow(false);

					onSuccess();
				} else {
					toast.error("Mã tàu đã tồn tại!");
				}
			} catch (error) {
				console.error("Lỗi khi thêm hãng đối tác:", error);
				toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
			}
		}
	};

	return (
		<>
			<Button style={{ fontWeight: "bold" }} variant="primary" onClick={handleShow}>
				Thêm hãng khai thác
			</Button>

			<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Modal thêm hãng khai thác</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Mã tàu</Form.Label>
							<Form.Control
								value={shipCode}
								onChange={(e) => setShipCode(e.target.value)}
								type="text"
								placeholder=""
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Tên tàu</Form.Label>
							<Form.Control
								value={shipName}
								onChange={(e) => setShipName(e.target.value)}
								type="text"
								placeholder=""
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Nhà sản xuất tàu</Form.Label>
							<Form.Control
								value={manufacturer}
								onChange={(e) => setManufacturer(e.target.value)}
								type="text"
								placeholder=""
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Mô tả tàu</Form.Label>
							<Form.Control
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								as="textarea"
								rows={3}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={() => handleSubmitForm()}>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default AddNewShipModal;
