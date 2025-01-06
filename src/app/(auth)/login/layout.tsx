import { ToastContainer } from 'react-toastify';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{children}
			<ToastContainer />
		</div>
	);
}
