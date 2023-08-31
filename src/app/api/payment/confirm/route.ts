import { NextResponse } from "next/server";

export function POST(request: Request) {
  console.log("Request Received");
  console.log(JSON.stringify(request.body));
  NextResponse.json({ status: "done" });
}
