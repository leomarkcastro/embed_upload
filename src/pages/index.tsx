/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from "react";
import { uploadMedia } from "@/lib/s3/upload";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [doneUploading, setDoneUploading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [totalProgress, setTotalProgress] = useState(0);

  const handleUpload = async () => {
    if (!uploadedFiles) return;
    const fileLength = uploadedFiles.length;
    if (fileLength === 0) return;
    let collectedUploads = [];
    setIsUploading(true);
    for (let i = 0; i < fileLength; i++) {
      const file = uploadedFiles[i];
      const res = await uploadMedia(file, (progress) => {
        setTotalProgress((i * 1) / fileLength + progress / fileLength);
      });
      collectedUploads.push(res);
    }
    if (window.top && window.top !== window.self) {
      window.top.postMessage(
        {
          source: "uploadr",
          eventName: "v1.uploadr.uploadComplete",
          data: {
            uploads: collectedUploads,
          },
        },
        "*"
      );
    }
    setDoneUploading(true);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-base-100">
      <div className="shadow-xl d-card w-96 bg-base-200">
        {doneUploading && (
          <div className="text-center d-card-body">
            <h1 className="text-3xl">Upload Complete</h1>
            <p>🥳🥳🥳🥳</p>
            <button
              className="d-btn d-btn-primary"
              onClick={() => {
                setUploadedFiles([]);
                setDoneUploading(false);
                setTotalProgress(0);
                setIsUploading(false);
                if (window.top && window.top !== window.self) {
                  window.top.postMessage(
                    {
                      source: "uploadr",
                      eventName: "v1.uploadr.close",
                      data: {},
                    },
                    "*"
                  );
                }
              }}
            >
              Close
            </button>
          </div>
        )}
        {!doneUploading && (
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
            <div
              className="w-full h-2 border rounded-md"
              style={{
                display: isUploading ? "block" : "none",
              }}
            >
              <div
                className="h-full transition-all bg-primary"
                style={{
                  width: `${totalProgress * 100}%`,
                }}
              ></div>
            </div>
            {uploadedFiles.length > 0 && (
              <button className="d-btn d-btn-primary" onClick={handleUpload}>
                Upload
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
