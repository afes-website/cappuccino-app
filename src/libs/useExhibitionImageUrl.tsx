import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { useState } from "react";

let imageIds: { [exhId: string]: string } | null = null;
let imageIdsFetchPromise: Promise<unknown> | null = null;

const useExhibitionImageUrl = (
  exhId: string,
  query?: { size?: "s" | "m" }
): string | null => {
  const [fetchStatus, setFetchStatus] = useState<
    "beforeInit" | "waitingPromise" | "ready"
  >("beforeInit");

  switch (fetchStatus) {
    case "beforeInit":
      if (!imageIdsFetchPromise) {
        imageIdsFetchPromise = api(aspida())
          .exhibitions.$get()
          .then((allStatus) => {
            imageIds = Object.fromEntries(
              Object.entries(allStatus.exhibition).map(([id, status]) => [
                id,
                status.info.thumbnail_image_id,
              ])
            );
          });
      }
      imageIdsFetchPromise.then(() => {
        setFetchStatus("ready");
      });
      setFetchStatus("waitingPromise");
      return null;
    case "waitingPromise":
      return null;
    case "ready":
      if (!imageIds || !{}.hasOwnProperty.call(imageIds, exhId)) return null;
      return api(aspida()).images._id(imageIds[exhId]).$path({ query });
  }
};

export default useExhibitionImageUrl;
