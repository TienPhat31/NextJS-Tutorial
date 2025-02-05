"use client";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import getKeycloakInstance from "@/lib/keycloak";

const Login = () => {

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


	return <div>{/* Có thể thêm nội dung ở đây nếu cần */}</div>;
};
export default Login;
