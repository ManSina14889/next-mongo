import Product from "@/models/Product";
import dbConnect from "@/lib/db";

export async function GET(request, { params }) {
  await dbConnect();
  console.log(params)
  const id = params._id;
  const product = await Product.findById(id).populate("category");
  console.log({ product });
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const id = params.id;
  return Response.json(await Product.findByIdAndDelete(id));
}
