import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    window.onmessage = function (e) {
      const eData = e.data.includes("uploadr-onupload");
      if (eData) {
        const embedData = e.data.split("::")[1];
        const data = JSON.parse(embedData);
        console.log(data);
      }
    };
  }, []);
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <iframe
        src="https://dmcc-uploader.int2.lv-aws-x3.xyzapps.xyz"
        className="w-[60vw] h-[60vh]"
      />
    </div>
  );
}
