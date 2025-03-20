import { Button } from "react-bootstrap";
import Upload from "../icons/Upload";

const UploadAsset = () => {
  return (
    <div className="upload-container">
      <img src="/upload.svg" alt="Upload Icon" className="upload-svg" />
      <Button variant="primary" className="upload-button" style={{display : "flex"}}>
        <Upload />
         Upload
      </Button>
    </div>
  );
};

export default UploadAsset;
