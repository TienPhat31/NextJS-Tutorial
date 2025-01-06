"use client";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaSearch } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import AddNewShipModal from "@/components/Ship/addNewShip.modal";

const Ships = () => {
	const [accessToken, setAccessToken] = useState<string>("");

	const [listShips, setListShips] = useState<any[]>([]);

	const router = useRouter();
    
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
		} catch (err: any) {
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

	// Fetching data
	useEffect(() => {
		fetchData();
	}, [accessToken]);

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
					<h1 style={{ paddingBottom: "40px", marginBottom: "8px" }}>QUẢN LÝ ĐỐI TÁC</h1>

					<Row style={{ width: "100%" }}>
						{/* Cột con thứ nhất */}
						<Col xs={12}>
							<Row>
								<Col xs={6}>
									<div style={{ position: "relative", width: "100%" }}>
										<Form.Control
											className="me-auto"
											placeholder="Add your item here..."
											style={{ paddingLeft: "40px" }} // Đẩy nội dung form sang phải
										/>
										<FaSearch
											style={{
												position: "absolute",
												top: "50%",
												left: "10px",
												transform: "translateY(-50%)",
												color: "#6c757d",
											}}
										/>
									</div>
								</Col>
								<Col>
									<div className="d-flex gap-3">
										<Form.Check type="checkbox" id="checkbox1" label="Đang hoạt động" />
										<Form.Check type="checkbox" id="checkbox2" label="Tạm dừng" />
									</div>
								</Col>
								<Col>
									<AddNewShipModal
										accessToken={accessToken}
										onSuccess={fetchData}
									></AddNewShipModal>
								</Col>
							</Row>

							<Table style={{ textAlign: "center" }} striped bordered hover className="mt-4">
								<thead>
									<tr>
										<th style={{ width: "5%" }}>#</th>
										<th style={{ width: "10%" }}>Mã đối tác</th>
										<th style={{ width: "15%" }}>Tên hãng tàu</th>
										<th style={{ width: "15%" }}>Tên hãng khai thác</th>
										<th style={{ width: "10%" }}>Trạng thái</th>
										<th style={{ width: "20%" }}>Mô tả</th>
										<th style={{ width: "7%" }}></th>
									</tr>
								</thead>
								<tbody>
									{Array.isArray(listShips) && listShips.length > 0 ? (
										listShips.map((ship, index) => (
											<tr key={ship.id}>
												<td>{index + 1}</td>
												<td>{ship.ship_code}</td>
												<td>{ship.ship_name}</td>
												<td>{ship.ship_manufacturer}</td>
												<td>{ship.status || "N/A"}</td>
												<td>{ship.description || "N/A"}</td>
												<td>
													<Button
														onClick={() =>
															router.push(`/ships/details/${ship.ship_code}`)
														}
														style={{
															alignItems: "center",
															width: "fit-content",
															fontWeight: "bold",
														}}
														variant="success"
													>
														Chi tiết
													</Button>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={7}>Không có dữ liệu</td>
										</tr>
									)}
								</tbody>
							</Table>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default Ships;
