import { useState } from "react";
import Masonry from "react-masonry-css";
import { Button, Form } from "react-bootstrap";
import { Search, ArrowDownUp } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddAssetButton from "../components/AddAssestButton";
import { useAssets } from "../context/AssestProvider";
import ImageEditor from "../components/ImageEditor";

type SortOrder = "newest" | "oldest" | "AtoZ";

const AssetGallery = () => {
  const { assets } = useAssets();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showImageEditorModal, setShowImageEditorModal] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (sortOrder === "newest") return b.id.localeCompare(a.id);
    if (sortOrder === "oldest") return a.id.localeCompare(b.id);
    return a.name.localeCompare(b.name);
  });

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageEditorModal(true);
  };

  return (
    <div className="container" style={{ marginTop: "150px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-4">
          <div className="d-flex align-items-center gap-2 border border-1 rounded px-2" 
               style={{ width: "450px", borderColor: "#334d6e", boxShadow: "none" }}>
            <Form.Control
              type="text"
              placeholder="Search Assets"
              className="border border-0"
              style={{ outline: "none", boxShadow: "none" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} style={{ cursor: "pointer" }} />
          </div>

          <Button 
            variant="light" 
            className="d-flex align-items-center gap-2 px-3 py-2 border"
            style={{ backgroundColor: "transparent", color: "#707683" }}
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          >
            {sortOrder === "newest" ? "Newest First" : "Oldest First"} 
            <ArrowDownUp size={14} />
          </Button>
        </div>
        <AddAssetButton />
      </div>

      <Masonry
        breakpointCols={{ default: 4, 1100: 3, 980: 2, 600: 1 }}
        className="d-flex gap-3"
        columnClassName="masonry-column"
      >
        {sortedAssets.map((asset, index) => (
          <div key={asset.id} className="mb-3">
            <img
              src={asset.src}
              alt={asset.name}
              className="img-fluid rounded shadow"
              style={{ width: "100%", display: "block", cursor: "pointer" }}
              onClick={() => handleImageClick(index)}
            />
          </div>
        ))}
      </Masonry>

      {showImageEditorModal && (
        <ImageEditor
          allImages={sortedAssets}
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageEditorModal(false)}
        />
      )}
    </div>
  );
};

export default AssetGallery;
