/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from "react";
import { uploadMedia } from "@/lib/s3/upload";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!uploadedFiles) return;
    const fileLength = uploadedFiles.length;
    let collectedUploads = [];
    for (let i = 0; i < fileLength; i++) {
      const file = uploadedFiles[i];
      const res = await uploadMedia(file);
      collectedUploads.push(res);
    }
    if (window.top && window.top !== window.self) {
      window.top.postMessage(
        `uploadr-onupload::${JSON.stringify(collectedUploads)}`,
        "*"
      );
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-base-100">
      <div className="shadow-xl d-card w-96 bg-base-200">
        <div className="text-center d-card-body">
          <h1 className="text-3xl">Upload your File</h1>
          <p>Max File Size Only of 100MB</p>
          <div
            {...getRootProps()}
            className="p-6 my-4 text-sm border border-dashed rounded border-primary"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : uploadedFiles.length > 0 ? (
              <ul className="max-h-[30vh] overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <li key={file.name}>
                    <button
                      className="pr-2 text-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFiles(
                          uploadedFiles.filter((f) => f.name !== file.name)
                        );
                      }}
                    >
                      X
                    </button>
                    <span className="text-tr">{file.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Drag n drop some files here, or click to select files</p>
            )}
          </div>

          <button className="d-btn d-btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </main>
  );
}
