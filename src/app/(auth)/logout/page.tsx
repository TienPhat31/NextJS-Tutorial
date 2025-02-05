"use client";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import getKeycloakInstance from "@/lib/keycloak";

const Logout = () => {
	const router = useRouter();
	const [keycloak, setKeycloak] = useState<any>(null); // Lưu trữ instance Keycloak
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		// Lấy instance của Keycloak khi component mount
		const keycloakInstance = getKeycloakInstance();
		setKeycloak(keycloakInstance);

		// Kiểm tra nếu token đã tồn tại và Keycloak đã authenticate
		keycloakInstance
			.init({ onLoad: "check-sso" })
			.then((authenticated: boolean) => {
				setIsAuthenticated(authenticated);
				if (!authenticated) {
					router.push("/login");
				}
			})
			.catch((error: any) => {
				console.error("Keycloak initialization failed", error);
				router.push("/login");
			});
	}, [router]);

	const handleLogout = async () => {
		if (keycloak) {
			try {
				await keycloak.logout({
					redirectUri: "http://localhost:3000/login", // Đường dẫn sau khi logout
				});

				// Xóa token khỏi sessionStorage
				sessionStorage.removeItem("accessToken");
				sessionStorage.removeItem("refreshToken");

				// Chuyển hướng về trang login
				router.push("/login");
			} catch (error) {
				console.error("Logout failed:", error);
			}
		}
	};

	return (
		<div className="modal show" style={{ display: "block", position: "initial" }}>
			<Modal.Dialog>
				<Modal.Header closeButton>
					<Modal.Title>Đăng xuất</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<p>Bạn có chắc muốn đăng xuất</p>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={() => router.back()} variant="secondary">
						Hủy
					</Button>
					<Button onClick={handleLogout} variant="danger">
						Đăng xuất
					</Button>
				</Modal.Footer>
			</Modal.Dialog>
		</div>
	);
};

export default Logout;
