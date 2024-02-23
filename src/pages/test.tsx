import { useEffect } from "react";

export default function App() {
  function subscribe(e: MessageEvent<any>) {
    const data = e.data;
    if (data?.source !== "uploadr" || !data?.eventName) return;

    switch (data.eventName) {
      case "v1.uploadr.uploadComplete":
        console.log(data.data);
        break;
      case "v1.uploadr.close":
        console.log("close");
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    window.addEventListener("message", subscribe);
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <iframe src="http://localhost:3000" className="w-[60vw] h-[60vh]" />
    </div>
  );
}
