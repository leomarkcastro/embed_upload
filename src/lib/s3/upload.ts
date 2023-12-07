import axios from "axios";

export const uploadMedia = async (
  file: File,
  onUploadProgress: (progress: number) => void
) => {
  try {
    // POST request to backend route handler
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/s3/ps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
      }),
    });
    // console.log(await res.json());
    // Response includes a putUrl for upload and a getUrl for displaying a preview
    const { putURL, getURL } = await res.json();

    const config = {
      onUploadProgress: (progressEvent: any) =>
        onUploadProgress(progressEvent.loaded / progressEvent.total),
    };

    // Request made to putUrl, media file included in body
    const uploadResponse = await axios.put(putURL, file, config);

    return { status: uploadResponse.status, uploadedUrl: getURL };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
