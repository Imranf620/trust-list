// app/api/service/route.js
import { NextResponse } from 'next/server';
import Service from '@/models/Service';
import connectDB from '@/lib/mongoose';

// GET Service (only one assumed)
export async function GET() {
  await connectDB();
  const service = await Service.findOne();
  return NextResponse.json({ service });
}

// Create or update Service
export async function POST(req) {
  await connectDB();
  const data = await req.json();
  let service = await Service.findOne();

  if (service) {
    // update
    await Service.updateOne({}, data);
    service = await Service.findOne();
  } else {
    // create
    service = await Service.create(data);
  }

  return NextResponse.json({ service });
}
