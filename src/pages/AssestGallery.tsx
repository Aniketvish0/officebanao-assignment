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
  const { assets, updateAsset } = useAssets();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showImageEditorModal, setShowImageEditorModal] = useState<boolean>(false);
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSortChange = (sortOrder: SortOrder) => {
    setSortOrder(sortOrder);
    setShowSortOptions(false);
  };

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (sortOrder === "newest") return b.id.localeCompare(a.id);
    if (sortOrder === "oldest") return a.id.localeCompare(b.id);
    if (sortOrder === "AtoZ") return a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageEditorModal(true);
  };

  const handleHide = (id: string) => {
    const index = assets.findIndex(asset => asset.id === id);
    if (index !== -1) {
      const updatedAsset = { ...assets[index], isHidden: true };
      updateAsset(updatedAsset, index);
    }
    setActiveDropdown(null);
  };
  return (
    <div className="container" style={{ marginTop: "150px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-4 position-relative">
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
          <div className="position-relative">
            <Button
              variant="light"
              className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 border"
              style={{ backgroundColor: "transparent", color: "#707683", width: "180px" }}
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              {sortOrder === "newest" ? "Newest First" : sortOrder === "oldest" ? "Oldest First" : "A-Z"}
              <ArrowDownUp size={14} />
            </Button>
            {showSortOptions && (
              <div className="position-absolute bg-white border rounded shadow-sm"
                   style={{ top: "110%", left: 0, width: "180px", zIndex: 10 }}>
                <div className="d-flex flex-column" style={{ gap: "8px", padding: "8px" }}>
                  <div style={{ cursor: "pointer" }} onClick={() => handleSortChange("newest")}>Newest First</div>
                  <div style={{ cursor: "pointer" }} onClick={() => handleSortChange("oldest")}>Oldest First</div>
                  <div style={{ cursor: "pointer" }} onClick={() => handleSortChange("AtoZ")}>A-Z</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <AddAssetButton />
      </div>

      <Masonry
        breakpointCols={{ default: 4, 1100: 3, 980: 2, 600: 1 }}
        className="d-flex gap-3"
        columnClassName="masonry-column"
      >
        {sortedAssets.map((asset, index) => {
          const initials = asset.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2);
          
          if (asset.isHidden) return null; // Skip hidden assets

          return (
            <div
              key={asset.id}
              className="position-relative mb-3"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredAssetId(asset.id)}
              onMouseLeave={() => setHoveredAssetId(null)}
            >
              <img
                src={asset.src}
                alt={asset.name}
                className="img-fluid rounded shadow w-100"
                style={{ display: "block" }}
                onClick={() => handleImageClick(index)}
              />
              {hoveredAssetId === asset.id && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between"
                  style={{ background: "rgba(0,0,0,0.3)", color: "#fff" }}
                >
                  <div className="p-2">{asset.name}</div>
                  <div className="p-2 d-flex align-items-center justify-content-end gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "25px",
                        height: "25px",
                        backgroundColor: "#fff",
                        color: "#000",
                        fontWeight: "bold",
                        fontSize: "10px",
                      }}
                    >
                      {initials}
                    </div>
                    <div
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === asset.id ? null : asset.id);
                      }}
                    >
                      ⋮
                    </div>
                    {activeDropdown === asset.id && (
                      <div
                        className="position-absolute bg-white shadow rounded p-2 text-dark"
                        style={{ right: "0", top: "100%", minWidth: "120px", zIndex: 10 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(index)
                        }}
                      >
                        <div
                          className="dropdown-item"
                          style={{ cursor: "pointer", padding: "5px" }}
                        >
                          Edit
                        </div>
                        <div
                          className="dropdown-item"
                          style={{ cursor: "pointer", padding: "5px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHide(asset.id);
                          }}
                        >
                          Hide
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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