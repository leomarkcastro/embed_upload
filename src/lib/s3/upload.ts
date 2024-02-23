import axios from "axios";

export const uploadMedia = async (
  file: File,
  onUploadProgress: (progress: number) => void
) => {
  try {
    // add current isotime to the file name
    const date = new Date();
    const isoTime = date.toISOString();
    // remove extension from file name
    const fileName = file.name.split(".")[0];
    const fileExtension = file.name.split(".")[1];
    let finalFileName = `${fileName}-${isoTime}`;
    // remove unsafe characters from file name
    finalFileName = finalFileName.replace(/[^a-zA-Z0-9]/g, "_");
    // add back the file extension
    finalFileName = `${finalFileName}.${fileExtension}`;

    // POST request to backend route handler
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/s3/ps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: finalFileName,
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

    return {
      status: uploadResponse.status,
      uploadedUrl: getURL,
      filename: file.name,
      mimetype: file.type,
      filesize: file.size,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
