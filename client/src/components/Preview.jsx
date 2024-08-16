import React from "react";

const Preview = ({ file }) => {
  const fileUrl = file.data;
  const fileType = file.type.split("/")[0];

  if (fileType === "image") {
    return (
      <img src={fileUrl} alt="preview" className="w-48 h-auto rounded-md" />
    );
  } else if (fileType === "video") {
    return <video controls src={fileUrl} className="w-48 h-auto rounded-md" />;
  } else if (fileType === "audio") {
    return <audio controls src={fileUrl} className="w-full" />;
  } else if (file.type === "application/pdf") {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View PDF
      </a>
    );
  } else {
    return (
      <a
        href={fileUrl}
        download={file.name}
        className="text-blue-500 underline"
      >
        Download File
      </a>
    );
  }
};

export default Preview;
