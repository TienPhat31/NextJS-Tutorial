"use client";
import Sidebar from "@/components/Sidebar/sideBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer } from 'react-toastify';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	
	return (
		<>
			<Row style={{ backgroundColor: "#f4f6f9" }}>
				<Col className="p-0" xs={12} sm={4} md={2} style={{ backgroundColor: "#f8f9fa" }}>
					<Sidebar></Sidebar>
				</Col>

				{/* Nội dung phần chiếm 70% màn hình */}
				<Col xs={12} sm={8} md={10}>
					<div>{children}</div>
				</Col>
			</Row>

			<ToastContainer />
		</>
	);
}
