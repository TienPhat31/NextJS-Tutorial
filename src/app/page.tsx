"use client";
import AppTable from "@/components/app.table";
import useSWR from "swr";
import { useEffect } from "react";

export default function Home() {
	const fetcher = (url: string) => fetch(url).then((res) => res.json());
	const { data, error, isLoading } = useSWR(
		"https://fake-json-api.mock.beeceptor.com/users",
		fetcher
	);

	if (!data) {
		return <div>Data is loading .....</div>;
	}

	return (
		<div>
			<AppTable users={data}></AppTable>
		</div>
	);
}
