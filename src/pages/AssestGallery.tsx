import { useState } from "react";
import Masonry from "react-masonry-css";
import { Button, Form } from "react-bootstrap";
import { Search, ArrowDownUp} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import AddAssestButton from "../components/AddAssestButton";

type sortOrder = "newest" | "oldest" | "AtoZ";

const AssestGallery = () => {
  const location = useLocation();
  const allImages : string[] = location.state?.images || [];
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder] = useState<sortOrder>("newest");
  const [assets] = useState<string[]>(allImages);

  const filteredAssets = assets.filter((asset) =>
    asset.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAssets = sortOrder === "newest" ? filteredAssets.reverse() : filteredAssets;

  return (
    <div className="container" style={{marginTop : "150px"}}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-4">
        <div className="d-flex align-items-center gap-2 border border-1 rounded px-2" style={{ width: "450px",borderColor : "#334d6e", boxShadow: "none" }}>
          <Form.Control
            type="text"
            placeholder="Search Assets "
            className="border border-0"
            style={{ outline: "none" , boxShadow : "none"}}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} style={{ cursor: "pointer" }} />
        </div>
        
        <Button 
        variant="light" 
        className="d-flex align-items-center gap-2 px-3 py-2 border"
        style={{backgroundColor : "transparent"}}
        >
          Newest First <ArrowDownUp size={14} />
        </Button>
        </div>
        <AddAssestButton/>
      </div>
      <Masonry
        breakpointCols={{ default: 4, 1100: 3,980:2, 600: 1 }}
        className="d-flex gap-3"
        columnClassName="masonry-column"
      >
        {sortedAssets.map((asset, index) => (
          <div key={index} className="mb-3">
            <img
              src={asset}
              alt={`Asset ${index}`}
              className="img-fluid rounded"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default AssestGallery;
