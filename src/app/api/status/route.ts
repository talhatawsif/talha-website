import { getStatuses } from "@/lib/status";

export async function GET() {
  try {
    return Response.json(await getStatuses());
  } catch {
    return Response.json({});
  }
}
