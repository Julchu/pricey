import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { IngredientFormData, PresignData } from "@/utils/interfaces";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ "ingredient-id": string }> },
) => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    if (!token)
      return new Response(JSON.stringify({ ingredient: null }), {
        status: 401,
      });

    const { "ingredient-id": ingredientId } = await params;
    const ingredientData: IngredientFormData = await req.json();

    const updateIngredientResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient/${ingredientId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredient: ingredientData }),
      },
    );

    const { success, data, error } = await updateIngredientResponse.json();
    if (!success)
      return new Response(error, { status: updateIngredientResponse.status });
    return new Response(JSON.stringify({ ingredient: data }), { status: 200 });
  } catch (error) {
    return new Response(`Ingredient update error: ${error}`, { status: 400 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ "ingredient-id": string }> },
) => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    if (!token)
      return new Response(JSON.stringify({ image: null }), { status: 401 });

    const { "ingredient-id": ingredientId } = await params;

    // Step 1: obtain presigned URL + fields from backend
    const presignResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient/${ingredientId}/image/presign`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const {
      success: presignSuccess,
      data: presignData,
      error: presignError,
    } = await presignResponse.json();

    if (!presignSuccess)
      return new Response(presignError, { status: presignResponse.status });

    const { url, fields, publicUrl } = presignData as PresignData;

    // Step 2: forward file to MinIO via the presigned POST
    const incoming = await req.formData();
    const file = incoming.get("file");

    if (!file || !(file instanceof Blob))
      return new Response("Missing file field", { status: 400 });

    const minioForm = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      minioForm.append(key, value);
    }
    minioForm.append("file", file);

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: minioForm,
    });

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();
      return new Response(`MinIO upload failed: ${text}`, {
        status: uploadResponse.status,
      });
    }

    return new Response(JSON.stringify({ publicUrl }), { status: 200 });
  } catch (error) {
    return new Response(`Ingredient image upload error: ${error}`, {
      status: 400,
    });
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ "ingredient-id": string }> },
) => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    if (!token)
      return new Response(JSON.stringify({ ingredientId: null }), {
        status: 401,
      });

    const { "ingredient-id": ingredientId } = await params;

    const deleteIngredientResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient/${ingredientId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await deleteIngredientResponse.json();
    if (!success)
      return new Response(error, { status: deleteIngredientResponse.status });
    return new Response(JSON.stringify({ ingredientId: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Ingredient deletion error: ${error}`, { status: 400 });
  }
};