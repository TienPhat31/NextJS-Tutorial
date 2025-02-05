"use client";
import { Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Testing = () => {
	const router = useRouter();

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
	}, []);

	// Fetching data
	useEffect(() => {
		if (!accessToken) return;

		const fetchData = async () => {
			try {
				const response = await axios.get("http://localhost/api/ftp-server/testing", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				setHost(response.data.safeUserData.host);
				setMode(response.data.safeUserData.mode);
				setUserName(response.data.safeUserData.ftp_userName);
				setPassword(response.data.safeUserData.ftp_password);
				setPort(response.data.safeUserData.port);

				setEmail(response.data.safeUserData.email);
				setCCEmail(response.data.safeUserData.cc_email);
				setTitleEmail(response.data.safeUserData.title_email);

				setUser(response.data.username);
				setUserEmai(response.data.userEmai);

				if (response.data.statusCode === 403) {
					toast.error("Bạn không có quyền truy cập!");
					sessionStorage.removeItem("accessToken");
					router.push("/login");
				}
			} catch (err: any) {
				if (err.response?.status === 401) {
					toast.error("Token hết hạn, vui lòng đăng nhập lại!");
					sessionStorage.removeItem("accessToken");
					router.push("/login");
				} else if (err.response?.data?.statusCode === 403) {
					toast.error("Bạn không có quyền truy cập");
				} else {
					console.error(err);
					toast.error("Server đang bị lỗi. Vui lòng bạn quay lại website sau!");
				}
			}
		};

		fetchData();
	}, [accessToken]);

	const handleFileChange = (e: any) => {
		const selectedFile = e.target.files[0];
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
					"http://localhost/api/ftp-server/testing",
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
			} catch (error: any) {
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
			const configUserDataDTO = {
				user_name: user,
				user_email: userEmail,
				email: email,
				cc_email: ccEmail,
				title_email: titleEmail,
				mode: mode,
				host: host,
				ftp_userName: userName,
				ftp_password: password,
				port: port,
			};

			try {
				const response = await axios.post(
					"http://localhost/api/ftp-server/configData",
					configUserDataDTO,
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
			} catch (error: any) {
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

	// Upload file
	const handleUploadFile = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!mode) formErrors.mode = "Mode is required!";
		if (!host) formErrors.host = "Host is required!";
		if (!userName) formErrors.userName = "Username is required!";
		if (!password) formErrors.password = "Password is required!";
		if (!port) formErrors.port = "Port is required!";
		if (!folder) formErrors.port = "folder is required!";
		if (!file) formErrors.port = "file  is required!";

		if (!email) formErrors.port = "Email is required!";
		if (!ccEmail) formErrors.port = "ccEmail is required!";
		if (!titleEmail) formErrors.port = "Title of email is required!";
		if (!contentEmail) formErrors.port = "Content of email is required!";
		if (isApplyEmail === false) formErrors.port = "Check box apply email is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const formData = new FormData();

			if (file) {
				formData.append("localFilePath", file);
			} else {
				console.error("No file selected");
				toast.error("Vui lòng chọn một tệp để tải lên.");
				return;
			}

			formData.append("user", userName);
			formData.append("user_email", userEmail);
			formData.append("email", email);
			formData.append("cc_email", ccEmail);
			formData.append("title_email", titleEmail);
			formData.append("content_email", contentEmail);
			formData.append("emailCheckBox", "on");
			formData.append("mode", mode);
			formData.append("remoteFilePath", folder);
			formData.append("host", host);
			formData.append("password", password);
			formData.append("port", String(port));

			try {
				const response = await axios.post(
					"http://localhost/api/ftp-server/upload",
					formData,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Upload file lên FTP server thành công!");
				} else {
					toast.error("Upload file lên FTP server thất bại!");
				}
			} catch (error: any) {
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

	// Delete file
	const handleDeleteFile = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!mode) formErrors.mode = "Mode is required!";
		if (!host) formErrors.host = "Host is required!";
		if (!userName) formErrors.userName = "Username is required!";
		if (!password) formErrors.password = "Password is required!";
		if (!port) formErrors.port = "Port is required!";
		if (!folder) formErrors.port = "folder is required!";
		if (!file) formErrors.port = "file  is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const formData = new FormData();

			if (file) {
				formData.append("localFilePath", file);
			} else {
				console.error("No file selected");
				toast.error("Vui lòng chọn một tệp để tải lên.");
				return;
			}

			formData.append("user", userName);
			formData.append("user_email", userEmail);
			formData.append("mode", mode);
			formData.append("remoteFilePath", folder);
			formData.append("host", host);
			formData.append("password", password);
			formData.append("port", String(port));

			try {
				const response = await axios.post(
					"http://localhost/api/ftp-server/delete",
					formData,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Delete file trên FTP server thành công!");
				} else {
					toast.error("Delete file trên FTP server thất bại!");
				}
			} catch (error) {
				console.error("Lỗi delete file trên FTP server:", error);
				toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
			}
		}
	};

	// Download file
	const handleDownloadFile = async () => {
		let formErrors: { [key: string]: string } = {};

		// Kiểm tra các trường bắt buộc
		if (!mode) formErrors.mode = "Mode is required!";
		if (!host) formErrors.host = "Host is required!";
		if (!userName) formErrors.userName = "Username is required!";
		if (!password) formErrors.password = "Password is required!";
		if (!port) formErrors.port = "Port is required!";
		if (!folder) formErrors.port = "folder is required!";
		if (!file) formErrors.port = "file  is required!";

		setErrors(formErrors);

		// Nếu có lỗi, hiển thị thông báo lỗi
		if (Object.keys(formErrors).length > 0) {
			for (let key in formErrors) {
				toast.error(formErrors[key]);
			}
		} else {
			const formData = new FormData();

			if (file) {
				formData.append("localFilePath", file);
			} else {
				console.error("No file selected");
				toast.error("Vui lòng chọn một tệp để tải lên.");
				return;
			}

			formData.append("user", userName);
			formData.append("user_email", userEmail);
			formData.append("mode", mode);
			formData.append("remoteFilePath", folder);
			formData.append("host", host);
			formData.append("password", password);
			formData.append("port", String(port));

			try {
				const response = await axios.post(
					"http://localhost/api/ftp-server/download",
					formData,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.data?.statusCode == 200 && response.data?.data === true) {
					toast.success("Download file trên FTP server thành công!");
				} else {
					toast.error("Không tồn tại file trên FTP server !");
				}
			} catch (error) {
				console.error("Lỗi download file trên FTP server:", error);
				toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
			}
		}
	};

	return (
		<Container style={{ marginTop: "50px" }}>
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

							<Button
								onClick={handleUploadFile}
								style={{ width: "100%", marginBottom: "15px" }}
								variant="warning"
								size="lg"
							>
								Upload file
							</Button>

							<Button
								onClick={handleDeleteFile}
								style={{ width: "100%", marginBottom: "15px" }}
								variant="danger"
								size="lg"
							>
								Delete file
							</Button>

							<Button
								onClick={handleDownloadFile}
								style={{ width: "100%", marginBottom: "15px" }}
								variant="info"
								size="lg"
							>
								Download file
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default Testing;
