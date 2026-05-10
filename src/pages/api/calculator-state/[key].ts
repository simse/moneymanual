import type { APIRoute } from "astro";
import {
	type CalculatorKey,
	calculatorStateSchemas,
} from "../../../lib/calculator-state-schemas";

export const prerender = false;

export const POST: APIRoute = async ({ params, request, session }) => {
	const key = params.key as CalculatorKey | undefined;
	const schema = key ? calculatorStateSchemas[key] : undefined;
	if (!key || !schema) {
		return new Response("Unknown calculator key", { status: 404 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return new Response("Invalid JSON", { status: 400 });
	}

	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return new Response("Invalid state shape", { status: 400 });
	}

	session?.set(key, parsed.data);
	return new Response(null, { status: 204 });
};
