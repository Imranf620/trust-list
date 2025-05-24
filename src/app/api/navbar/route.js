import connectDB from "@/lib/mongoose";
import NavbarItem from "@/models/NavbarItem";

export async function GET() {
  await connectDB();
  const items = await NavbarItem.find().sort({ order: 1 });
  return Response.json({ items });
}

export async function PUT(req) {
  await connectDB();
  try {
    const { _id, text, href, order } = await req.json();

    if (!_id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    const updated = await NavbarItem.findByIdAndUpdate(
      _id,
      { text, href, order },
      { new: true }
    );

    if (!updated) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    return Response.json({ message: "Updated successfully", item: updated });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
