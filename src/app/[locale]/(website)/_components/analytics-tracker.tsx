"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const VISITOR_KEY = "analytics_visitor_id";
const SESSION_KEY = "analytics_session_id";

function createId(): string {
	return crypto.randomUUID();
}

function getOrCreateId(key: string): string {
	let id = localStorage.getItem(key);

	if (!id) {
		id = createId();
		localStorage.setItem(key, id);
	}

	return id;
}

export default function AnalyticsTracker() {
	const pathname = usePathname();

	useEffect(() => {
		if (!API_URL || !pathname) return;

		try {
			const visitorId = getOrCreateId(VISITOR_KEY);
			const sessionId = getOrCreateId(SESSION_KEY);

			const payload = {
				visitor_id: visitorId,
				session_id: sessionId,
				event_name: "page_view",
				page_path: window.location.pathname,
				referrer: document.referrer || null,
			};

			void fetch(`${API_URL}/analytics/events`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(payload),
				keepalive: true,
			}).catch((error) => {
				console.error("Failed to record analytics event:", error);
			});
		} catch (error) {
			console.error("Analytics tracking error:", error);
		}
	}, [pathname]);

	return null;
}