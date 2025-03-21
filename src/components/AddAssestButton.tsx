import { Button } from "react-bootstrap";
import { Plus } from "lucide-react";
import { useAssets } from "../context/AssestProvider";
import { useNavigate } from "react-router-dom";

const AddAssetButton = () => {
  const { addAssets } = useAssets();
  const navigate = useNavigate();

  const handleUploadAsset = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg, image/png, image/jpg";
    input.multiple = true;
    input.onchange = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileNames = Array.from(files).map((file) => ({
          id: `asset-${Date.now()}-${Math.random()}`,
          src: URL.createObjectURL(file),
          file: file,
          name: `Asset ${String(Date.now()).slice(-3)}`,
        }));
        addAssets(fileNames);
        navigate('/gallery')
      }
    };
    input.click();
  };

  return (
    <Button
      variant="primary"
      className="upload-button d-flex align-items-center justify-content-center gap-1"
      style={{ backgroundColor: "#334d6e", borderRadius: "4px", padding: "12px 18px" }}
      onClick={handleUploadAsset}
    >
        <Plus />
        <span>Add</span>
    </Button>
  );
};

export default AddAssetButton;
