import React from "react";

const Preview = ({ file }) => {
  const fileUrl = file.data;
  const fileType = file.type.split("/")[0];

  if (fileType === "image") {
    return <img src={fileUrl} alt="preview" className="w-full h-[30vh] object-cover rounded-md" />;
  } else if (fileType === "video") {
    return <video controls src={fileUrl} className="w-full h-auto rounded-md" />;
  } else if (fileType === "audio") {
    return <audio controls src={fileUrl} className="w-full" />;
  } else if (file.type === "application/pdf") {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        Open PDF
      </a>
    );
  } else {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        Download File
      </a>
    );
  }
};

export default Preview;
