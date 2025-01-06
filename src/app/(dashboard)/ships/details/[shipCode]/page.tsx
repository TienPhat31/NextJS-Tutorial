"use client";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const ShipDetails = ({ params }: { params: Promise<{ shipCode: string }> }) => {
    const router = useRouter()

	const [user, setUser] = useState<string>("");
	const [userEmail, setUserEmai] = useState<string>("");

	const [mode, setMode] = useState("FTP");
	const [host, setHost] = useState<string>("");
	const [userName, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [port, setPort] = useState<number>(21);
	const [folder, setFolder] = useState<string>("");
	const [file, setFile] = useState<File | null>(null);

	const [email, setEmail] = useState<string>("");
	const [ccEmail, setCCEmail] = useState<string>("");
	const [titleEmail, setTitleEmail] = useState<string>("");
	const [contentEmail, setContentEmail] = useState<string>("");
	const [isApplyEmail, setIsApplyEmail] = useState<boolean>(false);

	const { shipCode } = use(params);

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

	// Fetching data
	useEffect(() => {
		if (!accessToken) return;

		const fetchData = async () => {
			try {
				const response = await axios.get(`http://localhost:3001/ships/details/${shipCode}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					}
				});

				setMode(response.data.ship.mode)
                setHost(response.data.ship.host)
                setUserName(response.data.ship.userName)
                setPassword(response.data.ship.password)
                setPort(response.data.ship.port)
                setFolder(response.data.ship.remoteFilePath)
                setEmail(response.data.ship.email)
                setCCEmail(response.data.ship.cc_email)
                setTitleEmail(response.data.ship.title_email)
                setContentEmail(response.data.ship.content_email)


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

	const handleFileChange = (e: any) => {
		const selectedFile = e.target.files[0];
		console.log("FILE", selectedFile);
		setFile(selectedFile);
	};

	// KIỂM TRA KẾT NỐI
	const handleTestConnection = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!mode) formErrors.mode = "Mode is required!";
		if (!host) formErrors.host = "Host is required!";
		if (!userName) formErrors.userName = "Username is required!";
		if (!password) formErrors.password = "Password is required!";
		if (!port) formErrors.port = "Port is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const ftpServerDTO = {
				mode: mode,
				host: host,
				user: userName,
				password: password,
				port: port,
			};

			try {
				const response = await axios.post(
					"http://localhost:3001/ftp-server/testing",
					ftpServerDTO,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Kết nối FTP thành công!");
				} else {
					toast.error("Kết nối FTP thất bại!");
				}
			} catch (error) {
				console.error("Lỗi khi kiểm tra kết nối FTP:", error);
				toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
			}
		}
	};

	// SAVE DATA OF USER INTO DATABASE
	const handleSaveUserData = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!mode) formErrors.mode = "Mode is required!";
		if (!host) formErrors.host = "Host is required!";
		if (!userName) formErrors.userName = "Username is required!";
		if (!password) formErrors.password = "Password is required!";
		if (!port) formErrors.port = "Port is required!";
		if (!email) formErrors.port = "Email is required!";
		if (!ccEmail) formErrors.port = "ccEmail is required!";
		if (!titleEmail) formErrors.port = "Title of email is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const configShipData = {
                remoteFilePath: folder,
                content_email: contentEmail,
				email: email,
				cc_email: ccEmail,
				title_email: titleEmail,
				mode: mode,
				host: host,
                userName: userName,
				password: password,
				port: port,
			};

			try {
				const response = await axios.post(
					`http://localhost:3001/ships/saveConfigShipData/${shipCode}`,
					configShipData,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Lưu thông tin người dùng thành công!");
				} else {
					toast.error("Lưu thông tin người dùng thất bại!");
				}
			} catch (error) {
				console.error("Lỗi khi Lưu thông tin người dùng:", error);
				toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
			}
		}
	};

	return (
		<Container style={{ marginTop: "50px" }}>
			<h1>
				<p>Ship Code: {shipCode}</p>
			</h1>

			<Row className="align-items-stretch" style={{ height: "100%" }}>
				{/* Form ở cột bên trái */}
				<Col
					md={4}
					className="d-flex align-items-center mr-5"
					style={{
						padding: "20px",
						marginRight: "15px",
						backgroundColor: "white",
						borderRadius: "10px",
						boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
					}}
				>
					<Form style={{ width: "100%" }}>
						<h1 style={{ textAlign: "center", paddingBottom: "20px" }}>THIẾT LẬP EMAIL</h1>

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label style={{ fontWeight: "bold" }}>Email address</Form.Label>
							<Form.Control
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label style={{ fontWeight: "bold" }}>CC Email address</Form.Label>
							<Form.Control
								type="email"
								placeholder="admin@example.com"
								value={ccEmail}
								onChange={(e) => setCCEmail(e.target.value)}
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label style={{ fontWeight: "bold" }}>Tiêu đề Email</Form.Label>
							<Form.Control
								type="text"
								value={titleEmail}
								onChange={(e) => setTitleEmail(e.target.value)}
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label style={{ fontWeight: "bold" }}>Nội dung Email</Form.Label>
							<Form.Control
								as="textarea"
								rows={5}
								value={contentEmail}
								onChange={(e) => setContentEmail(e.target.value)}
							/>
						</Form.Group>

						<Form.Check
							type="switch"
							id="custom-switch"
							label="Apply email	"
							checked={isApplyEmail}
							onChange={() => setIsApplyEmail(!isApplyEmail)}
						/>
					</Form>
				</Col>

				{/* Form ở cột bên phải */}
				<Col
					md={7}
					className="d-flex flex-column align-items-center"
					style={{
						paddingTop: "20px",
						backgroundColor: "white",
						borderRadius: "10px",
						boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
					}}
				>
					<h1 style={{ textAlign: "center", paddingBottom: "20px", marginBottom: "8px" }}>
						FTP SERVER
					</h1>

					{/* Nội dung form */}
					<Row style={{ width: "100%" }}>
						{/* Cột con thứ nhất */}
						<Col xs={8}>
							<Form>
								<Form.Group className="mb-3" controlId="formInput1">
									<Form.Label style={{ fontWeight: "bold" }}>Mode</Form.Label>
									<Form.Select
										aria-label="Default select example"
										value={mode}
										onChange={(e) => setMode(e.target.value)}
									>
										<option value="FTP">FTP</option>
										<option value="SFTP">SFTP</option>
										<option value="FTP-PASSIVE">FTP-PASSIVE</option>
										<option value="FTP-ACTIVE">FTP-ACTIVE</option>
									</Form.Select>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>Host</Form.Label>
									<Form.Control
										type="text"
										placeholder="127.X.X.X"
										value={host}
										onChange={(e) => setHost(e.target.value)}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>User name</Form.Label>
									<Form.Control
										type="text"
										value={userName}
										onChange={(e) => setUserName(e.target.value)}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>Password</Form.Label>
									<Form.Control
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>Port</Form.Label>
									<Form.Control
										type="number"
										value={port}
										onChange={(e) => setPort(Number(e.target.value))}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label style={{ fontWeight: "bold" }}>Folder</Form.Label>
									<Form.Control
										type="text"
										value={folder}
										onChange={(e) => setFolder(e.target.value)}
									/>
								</Form.Group>

								<Form.Group controlId="formFile" className="mb-3">
									<Form.Label style={{ fontWeight: "bold" }}>
										Choose file to upload
									</Form.Label>
									<Form.Control type="file" onChange={handleFileChange} />
								</Form.Group>
							</Form>
						</Col>

						{/* Cột con thứ hai */}
						<Col xs={4}>
							<Button
								onClick={handleTestConnection}
								style={{ width: "100%", marginBottom: "15px" }}
								variant="primary"
								size="lg"
							>
								Kiểm tra kết nối
							</Button>

							<Button
								onClick={handleSaveUserData}
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

export default ShipDetails;
