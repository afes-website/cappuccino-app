import { useState } from "react";
import api from "@afes-website/docs";
import { useAspidaClient } from "components/AspidaClientContext";

let imageIds: { [exhId: string]: string } | null = null;
let imageIdsFetchPromise: Promise<unknown> | null = null;

const useExhibitionImageUrl = (
  exhId: string,
  query?: { size?: "s" | "m" }
): string | null => {
  const aspida = useAspidaClient();

  const [fetchStatus, setFetchStatus] = useState<
    "beforeInit" | "waiting" | "ready"
  >("beforeInit");

  switch (fetchStatus) {
    case "beforeInit":
      if (!imageIdsFetchPromise) {
        imageIdsFetchPromise = api(aspida)
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
      setFetchStatus("waiting");
      return null;
    case "waiting":
      return null;
    case "ready":
      if (!imageIds || !Object.prototype.hasOwnProperty.call(imageIds, exhId))
        return null;
      return api(aspida).images._id(imageIds[exhId]).$path({ query });
  }
};

export default useExhibitionImageUrl;
