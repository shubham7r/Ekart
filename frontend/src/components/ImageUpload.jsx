import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

const ImageUpload = ({ productData, setProductData }) => {
  // ✅ Upload Images
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files],
      }));
    }
  };

  // ✅ Remove Image (YOUR CODE FIXED)
  const removeImage = (index) => {
    setProductData((prev) => {
      const updatedImages = prev.productImg.filter((_, i) => i !== index);

      return {
        ...prev,
        productImg: updatedImages,
      };
    });
  };

  return (
    <div className="grid gap-2">
      <Label>Product Images</Label>

      {/* Hidden Input */}
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      {/* Upload Button */}
      <Button variant="outline">
        <label htmlFor="file-upload" className="cursor-pointer w-full">
          Upload Images
        </label>
      </Button>

      {/* Image Preview */}
      {productData.productImg.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
          {productData.productImg.map((file, idx) => {
            let preview;

            // ✅ Handle all cases
            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <Card key={idx} className="relative group overflow-hidden">
                <CardContent className="p-0">
                  {/* Image */}
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-32 object-cover rounded-md"
                  />

                  {/* ❌ Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
