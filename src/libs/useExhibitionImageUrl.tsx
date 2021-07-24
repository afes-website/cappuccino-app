import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { useEffect, useState } from "react";

let imageIds: { [exhId: string]: string } | null = null;

const useExhibitionImageUrl = (
  exhId: string,
  query?: { size?: "s" | "m" }
): string | null => {
  const [imageId, setImageId] = useState<string | null>(null);

  useEffect(() => {
    if (imageIds) setImageId(exhId in imageIds ? imageIds[exhId] : null);
  }, [exhId]);

  useEffect(() => {
    if (!imageIds)
      api(aspida())
        .exhibitions.$get()
        .then((allStatus) => {
          imageIds = Object.fromEntries(
            Object.entries(allStatus.exhibition).map(([id, status]) => [
              id,
              status.info.thumbnail_image_id,
            ])
          );
          if (exhId in imageIds) setImageId(imageIds[exhId]);
        });
  }, [exhId]);

  if (!imageIds) return null;
  return imageId ? api(aspida()).images._id(imageId).$path({ query }) : null;
};

export default useExhibitionImageUrl;
