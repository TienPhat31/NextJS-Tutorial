"use client";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const Templates = () => {

    const router = useRouter()
	const [accessToken, setAccessToken] = useState<string>("");

	const [listShips, setListShips] = useState<any[]>([]);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const [ship, setShip] = useState<string>("");
	const [file, setFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState<string>("");

	const handleFileChange = (e: any) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
	};

	// Lấy token
	useEffect(() => {
		// Chỉ truy cập sessionStorage khi component đã được mount (render trên client)
		const token = sessionStorage.getItem("accessToken");
		if (token) {
			setAccessToken(token);
		} else {
			router.push("/login");
		}
	}, [router]);

	const fetchData = async () => {
		if (!accessToken) return;
		try {
			const response = await axios.get("http://localhost:3001/ships", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			setListShips(response.data.listShips);
		} catch (err:any) {
			if (err.response?.status === 401) {
				toast.error("Token hết hạn, vui lòng đăng nhập lại!");
				sessionStorage.removeItem("accessToken"); // Xóa token cũ
				router.push("/login"); // Chuyển hướng về login
			} else {
				console.error(err);
				toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
			}
		}
	};

	useEffect(() => {
		fetchData();
	}, [accessToken]);

	const handleSaveTemplate = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!ship) formErrors.mode = "Ship is required!";
		if (!file) formErrors.host = "File  is required!";
		if (!fileName) formErrors.userName = "File name  is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const formData = new FormData();

			if (file) {
				formData.append("file", file);
			} else {
				console.error("No file selected");
				toast.error("Vui lòng chọn một tệp để tải lên.");
				return;
			}

			formData.append("shipCode", ship);
			formData.append("ftpFileName", fileName);

			try {
				const response = await axios.post(
					"http://localhost:3001/templates/save-template", // Endpoint API
					formData,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "multipart/form-data",
						},
						withCredentials: true,
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Lưu templates thành công!");
				} else if (response.data?.statusCode == 404 && response.data?.data === false) {
					toast.warning("Vui lòng cấu hình đối tác!");
				} else {
					toast.error("Lưu templates thất bại!");
				}
			} catch (error) {
				console.error("Lỗi khi lưu templates:", error);
				toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
			}
		}
	};

	return (
		<Container style={{ marginTop: "100px" }}>
			<Row className="align-items-stretch" style={{ height: "100%" }}>
				<Col
					md={12}
					className="d-flex flex-column align-items-center"
					style={{
						paddingTop: "20px",
						backgroundColor: "white",
						borderRadius: "10px",
						boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
					}}
				>
					{/* Tiêu đề nằm trên cùng */}
					<h1 style={{ textAlign: "center", paddingBottom: "40px", marginBottom: "8px" }}>
						QUẢN LÝ TEMPLATES
					</h1>

					{/* Nội dung form */}
					<Row style={{ width: "100%" }}>
						<Col xs={12}>
							<Form>
								<Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
									<Form.Label
										column
										sm="2"
										style={{ fontWeight: "bold", fontSize: "20px" }}
									>
										Đối tác
									</Form.Label>
									<Col sm="10">
										<Form.Select
											aria-label="Default select example"
											value={ship}
											onChange={(e) => setShip(e.target.value)}
										>
											<option>Chọn đối tác</option>
											{Array.isArray(listShips) && listShips.length > 0 ? (
												listShips.map((ship) => (
													<option key={ship.id} value={ship.ship_code}>
														{ship.ship_code || "N/A"}
													</option>
												))
											) : (
												<option disabled>Không có dữ liệu</option>
											)}
										</Form.Select>
									</Col>
								</Form.Group>

								<Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
									<Form.Label
										column
										sm="2"
										style={{ fontWeight: "bold", fontSize: "20px" }}
									>
										File
									</Form.Label>
									<Col sm="10">
										<div style={{ position: "relative", width: "100%" }}>
											<Form.Control
												type="file"
												style={{ paddingRight: "40px" }}
												onChange={handleFileChange}
											/>
											<FaEye
												style={{
													fontWeight: "bold",
													position: "absolute",
													top: "50%",
													right: "10px",
													transform: "translateY(-50%)",
													cursor: "pointer",
													color: "#6c757d",
												}}
											/>
										</div>
									</Col>
								</Form.Group>

								<Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
									<Form.Label
										column
										sm="2"
										style={{ fontWeight: "bold", fontSize: "20px" }}
									>
										FTP file name
									</Form.Label>
									<Col sm="10">
										<Form.Control
											type="text"
											value={fileName}
											onChange={(e) => setFileName(e.target.value)}
										/>
									</Col>
								</Form.Group>
							</Form>

							<Row className="justify-content-end">
								<Button
									onClick={handleSaveTemplate}
									style={{
										width: "fit-content",
										marginBottom: "15px",
										marginTop: "20px",
										fontWeight: "bold",
									}}
									variant="primary"
									size="lg"
								>
									Lưu template
								</Button>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default Templates;
