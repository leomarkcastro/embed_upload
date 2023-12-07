export const uploadMedia = async (file: File) => {
  try {
    // POST request to backend route handler
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/s3/ps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
      }),
    });
    // console.log(await res.json());
    // Response includes a putUrl for upload and a getUrl for displaying a preview
    const { putURL, getURL } = await res.json();

    // Request made to putUrl, media file included in body
    const uploadResponse = await fetch(putURL, {
      body: file,
      method: "PUT",
      headers: { "Content-Type": file.type },
    });

    return { status: uploadResponse.ok, uploadedUrl: getURL };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
