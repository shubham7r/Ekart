import React, { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    if (images?.length) {
      setMainImg(images[0].url);
    }
  }, [images]);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-3">
        {images?.map((img, index) => (
          <img
            key={index}
            src={img.url}
            onClick={() => setMainImg(img.url)}
            className="w-20 h-20 border cursor-pointer"
          />
        ))}
      </div>

      <Zoom>
        <img src={mainImg} alt="" className="w-[500px] border shadow-lg" />
      </Zoom>
    </div>
  );
};

export default ProductImg;
