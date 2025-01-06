import { Nav } from "react-bootstrap";
import { FaSignOutAlt, FaServer, FaUserCog } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import { useRouter } from "next/navigation";
import { GrTemplate } from "react-icons/gr";
import { IoLogOut } from "react-icons/io5";
import "@/styles/sideBar/sideBar.css";
import { SiSwagger } from "react-icons/si";

const Sidebar = () => {
	const router = useRouter();

	return (
		<div
			style={{
				padding: "20px",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				backgroundColor: "#2980b9",
			}}
		>
			<div
				style={{
					cursor: "pointer",
					marginBottom: "20px",
					textAlign: "center",
					color: "white",
				}}
			>
				<h2 className="mx-4" onClick={() => router.push("/")}>
					HỆ THỐNG QUẢN LÝ
				</h2>
			</div>

			{/* Navigation Menu */}
			<div style={{ flex: 1, fontSize: "21px" }}>
				<Nav className="flex-column">
					<Nav.Link
						onClick={() => router.push("/ftp-server/testing")}
						style={{ marginTop:"40px", marginBottom: "20px", color: "white" }}
					>
						<FaServer style={{  marginRight: "20px" }} />
						Thiết lập FTP server
					</Nav.Link>

					<Nav.Link onClick={() => router.push("/ftp-server/email-config")} style={{marginBottom: "20px", color: "white" }}>
						<MdMarkEmailUnread style={{ marginRight: "10px" }} />
						Cấu hình Email
					</Nav.Link>

					<Nav.Link onClick={() => router.push("/ships")} style={{ marginBottom: "20px", color: "white" }}>
						<FaUserCog style={{ marginRight: "10px" }} />
						Quản lý đối tác
					</Nav.Link>

					<Nav.Link  onClick={() => router.push("/templates")} style={{ marginBottom: "20px", color: "white" }}>
						<GrTemplate style={{ marginRight: "10px" }} />
						Quản lý templates
					</Nav.Link>

					<Nav.Link  onClick={() => router.push("http://localhost:3001/ftp-server/api")} style={{ marginBottom: "20px", color: "white" }}>
						<SiSwagger  style={{ marginRight: "10px" }} />
						Swagger
					</Nav.Link>
				</Nav>
			</div>

			{/* Logout */}
			<div
				style={{
					fontSize: "21px",
					fontWeight: "bold",
					marginBottom: "25px",
					marginLeft: "10px",
				}}
			>
				<Nav.Link href="/logout" style={{ color: "white" }}>
					<IoLogOut style={{ marginRight: "10px" }} />
					Đăng xuất
				</Nav.Link>
			</div>
		</div>
	);
};

export default Sidebar;
