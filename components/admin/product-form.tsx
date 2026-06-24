"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@/lib/validators";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { productDefaultValues } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import slugify from "slugify";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { Product } from "@/types";
import z from "zod";
import { toast } from "sonner";

type ProductFormProps = {
  type: "Create" | "Update";
  product?: Product;
};

const ProductForm = ({ type, product }: ProductFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues:
      product && type === "Update"
        ? {
            id: product.id ?? "",
            name: product.name ?? "",
            slug: product.slug ?? "",
            category: product.category,
            brand: product.brand ?? "",
            description: product.description ?? "",
            images: product.images ?? [],
            variants:
              product.variants?.map((v) => ({
                id: v.id ?? "",
                productId: v.productId ?? "",
                size: v.size ?? "",
                type: v.type ?? "Perfume",
                price: String(v.price ?? "0.00"),
              })) ?? [],
          }
        : productDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const handleGenerateSlug = () => {
    const nameValue = form.getValues("name");
    if (nameValue) {
      const generatedSlug = slugify(nameValue, { lower: true, strict: true });
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: z.infer<typeof insertProductSchema>) => {
    startTransition(async () => {
      const res =
        type === "Create"
          ? await createProduct(values)
          : await updateProduct(values);

      if (res.success) {
        toast.success(res.message);
        router.push("/admin/products");
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Form {...form}>
      {/* Διατήρηση του console.log στα errors για σιγουριά */}
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log("Zod Errors:", errors),
        )}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateSlug}
                  >
                    Generate
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["Men", "Women", "Niche", "Unisex"].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* UPLOADTHING IMAGES FIELD */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Product Images</FormLabel>
              <div className="flex flex-wrap gap-4 items-center border p-4 rounded-md min-h-30">
                {field.value &&
                  field.value.map((url: string) => (
                    <div
                      key={url}
                      className="relative w-25 h-25 border rounded-md overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(
                            field.value.filter((img: string) => img !== url),
                          )
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const urls = res.map((file) => file.url);
                    field.onChange([...(field.value || []), ...urls]);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Upload Error: ${error.message}`);
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* VARIANTS SECTION */}
        <div className="border p-4 rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Product Variants</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  id: "",
                  productId: "",
                  size: "",
                  type: "Perfume",
                  price: "0.00",
                })
              }
            >
              Add Variant
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end border-b pb-4">
              <FormField
                control={form.control}
                name={`variants.${index}.size`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input placeholder="100ml" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variants.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "Perfume",
                          "Lotion",
                          "Gel",
                          "Oil",
                          "Beard Oil",
                          "Car Fragrance",
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variants.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value as string}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {/* <Input type="text" {...field} /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? "Submitting..."
            : type === "Create"
              ? "Create Product"
              : "Update Product"}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
