"use client";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "react-toastify";

const Email_Config = () => {
	const router = useRouter()

	const [hostMailer, setHostMailer] = useState<string>("");
	const [portMailer, setPortMailer] = useState<string>("");
	const [userMailer, setUserMailer] = useState<string>("");
	const [passwordMailer, setPasswordMailer] = useState<string>("");
	const [fromEmail, setFromEmail] = useState<string>("");

	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const [accessToken, setAccessToken] = useState<string>("");

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

	// Fetch data
	useEffect(() => {
		if (!accessToken) return;

		const fetchData = async () => {
			try {
				const response = await axios.get("http://localhost:3001/ftp-server/email_config", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				setHostMailer(response.data.host);
				setPortMailer(response.data.port);
				setUserMailer(response.data.user);
				setPasswordMailer(response.data.password);
				setFromEmail(response.data.from);
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

		fetchData();
	}, [accessToken]);

	// CHECK EMAIL SMTP
	const handleCheckSMPT = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!hostMailer) formErrors.mode = "Host Mailer is required!";
		if (!portMailer) formErrors.host = "Port Mailer is required!";
		if (!userMailer) formErrors.userName = "User mailer is required!";
		if (!passwordMailer) formErrors.password = "Password mailer is required!";
		if (!fromEmail) formErrors.port = "From email  is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const checkSmtpDTO = {
				host_mailer: hostMailer,
				port_mailer: portMailer,
				user_mailer: userMailer,
				password_mailer: passwordMailer,
				from_mailer: fromEmail,
			};

			try {
				const response = await axios.post(
					"http://localhost:3001/ftp-server/checkSMTP",
					checkSmtpDTO,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Kết nối SMTP thành công!");
				} else {
					toast.error("Kết nối STMP thất bại!");
				}
			} catch (error:any) {
				if (error.response?.status === 401) {
					toast.error("Token hết hạn, vui lòng đăng nhập lại!");
					sessionStorage.removeItem("accessToken");
					router.push("/login");
				} else {
					console.error(error);
					toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
				}
			}
		}
	};

	// SAVE EMAIL CONFIG
	const handleEmailConfig = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!hostMailer) formErrors.mode = "Host Mailer is required!";
		if (!portMailer) formErrors.host = "Port Mailer is required!";
		if (!userMailer) formErrors.userName = "User mailer is required!";
		if (!passwordMailer) formErrors.password = "Password mailer is required!";
		if (!fromEmail) formErrors.port = "From email  is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const emailConfigDTO = {
				host_mailer: hostMailer,
				port_mailer: portMailer,
				user_mailer: userMailer,
				password_mailer: passwordMailer,
				from_mailer: fromEmail,
			};

			try {
				const response = await axios.post(
					"http://localhost:3001/ftp-server/emailConfig",
					emailConfigDTO,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Lưu cấu hình Email thành công!");
				} else {
					toast.error("Lưu cấu hình Email thất bại!");
				}
			} catch (error) {
				console.error("Lỗi khi lưu cấu hình Email:", error);
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
					<h1 style={{ textAlign: "center", paddingBottom: "20px", marginBottom: "8px" }}>
						CẤU HÌNH EMAIL
					</h1>

					{/* Nội dung form */}
					<Row style={{ width: "100%" }}>
						{/* Cột con thứ nhất */}
						<Col xs={9}>
							<Form>
								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>HOST MAILER</Form.Label>
									<Form.Control
										type="text"
										placeholder="127.X.X.X"
										value={hostMailer}
										onChange={(e) => setHostMailer(e.target.value)}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>PORT MAILER</Form.Label>
									<Form.Control
										type="text"
										value={portMailer}
										onChange={(e) => setPortMailer(e.target.value)}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>USER MAILER</Form.Label>
									<Form.Control
										type="text"
										value={userMailer}
										onChange={(e) => setUserMailer(e.target.value)}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>PASSWORD MAILER</Form.Label>
									<Form.Control
										type="password"
										value={passwordMailer}
										onChange={(e) => setPasswordMailer(e.target.value)}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>FROM EMAIL</Form.Label>
									<Form.Control
										type="text"
										value={fromEmail}
										onChange={(e) => setFromEmail(e.target.value)}
									/>
								</Form.Group>
							</Form>
						</Col>

						{/* Cột con thứ hai */}
						<Col xs={3}>
							<Button
								onClick={handleCheckSMPT}
								style={{ width: "100%", marginBottom: "15px" }}
								variant="primary"
								size="lg"
							>
								Kiểm tra SMTP
							</Button>

							<Button
								onClick={handleEmailConfig}
								style={{ width: "100%", marginBottom: "15px" }}
								variant="success"
								size="lg"
							>
								Lưu
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default Email_Config;
