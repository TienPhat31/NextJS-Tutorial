"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import getKeycloakInstance from "@/lib/keycloak";

const Login = () => {
	const [username, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	// ROUTER
	const router = useRouter();
	const keycloak = useRef<any>(null);

	useEffect(() => {
		if (!keycloak.current) {
			// Lấy instance Keycloak nếu chưa có
			keycloak.current = getKeycloakInstance();
		}

		// Kiểm tra nếu chưa được khởi tạo
		if (!keycloak.current.authenticated) {
			keycloak.current
				.init({ onLoad: "login-required", pkceMethod: "S256" })
				.then((authenticated: boolean) => {
					if (authenticated) {
						// Lưu accessToken vào sessionStorage
						sessionStorage.setItem("accessToken", keycloak.current.token);

						// Lưu refreshToken vào sessionStorage nếu cần
						sessionStorage.setItem("refreshToken", keycloak.current.refreshToken);

						router.push("/ftp-server/testing");
					} else {
						keycloak.current.login();
					}
				})
				.catch((error: any) => {
					console.error("Keycloak initialization failed", error);
					toast.error(
						"Keycloak initialization failed: " + (error?.message || "Unknown error occurred")
					);
				});
		} else {
			const tokenExpiration = keycloak.current.tokenParsed?.exp * 1000; // Thời gian hết hạn của token (milisecond)
			console.log("Token expiration:", tokenExpiration);
			const currentTime = new Date().getTime();

			if (tokenExpiration && currentTime > tokenExpiration) {
				keycloak.current
					.updateToken(70) // Làm mới token nếu còn ít hơn 70 giây
					.then((refreshed: boolean) => {
						if (refreshed) {
							console.log("Token updated");
							sessionStorage.setItem("accessToken", keycloak.current.token);
							router.push("ftp-server/testing");
						} else {
							window.location.reload();
						}
					})
					.catch((error: any) => {
						console.error("Token refresh failed", error);
						window.location.reload();
					});
			}
		}
	}, [router]);

	// return (
	// 	<Container
	// 		className="my-5"
	// 		style={{
	// 			height: "700px",
	// 			width: "1200px",
	// 			boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
	// 		}}
	// 	>
	// 		<Row className="align-items-center h-100">
	// 			<Col sm={7} style={{ paddingLeft: "50px", paddingRight: "50px" }}>
	// 				<h1 className="text-center mb-4">Login</h1>
	// 				<Form onSubmit={handleLoginButton}>
	// 					{/* Email */}
	// 					<Form.Group className="mb-3" controlId="formEmail">
	// 						<Form.Label>User name</Form.Label>
	// 						<Form.Control
	// 							type="text"
	// 							placeholder="User name"
	// 							required
	// 							value={username}
	// 							onChange={(e) => setUserName(e.target.value)}
	// 						/>
	// 					</Form.Group>

	// 					{/* Password */}
	// 					<Form.Group className="mb-3" controlId="formPassword">
	// 						<Form.Label>Password</Form.Label>
	// 						<Form.Control
	// 							type="password"
	// 							placeholder="Enter your password"
	// 							required
	// 							value={password}
	// 							onChange={(e) => setPassword(e.target.value)}
	// 						/>
	// 					</Form.Group>

	// 					{/* Remember Me */}
	// 					<Form.Group className="mb-3" controlId="formRememberMe">
	// 						<Form.Check type="checkbox" label="Remember me" />
	// 					</Form.Group>

	// 					{/* Submit Button */}
	// 					<Button variant="success" type="submit" className="w-100">
	// 						Login
	// 					</Button>
	// 				</Form>
	// 			</Col>

	// 			<Col sm={5} className="h-100 p-0">
	// 				<Image
	// 					src="/background.png"
	// 					alt="Background"
	// 					className="w-100 h-100"
	// 					style={{ objectFit: "cover" }}
	// 					fluid
	// 				/>
	// 			</Col>
	// 		</Row>
	// 	</Container>
	// );

	return <div>{/* Có thể thêm nội dung ở đây nếu cần */}</div>;
};
export default Login;
