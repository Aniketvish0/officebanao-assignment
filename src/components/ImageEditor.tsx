import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Crop, RotateCcw, RotateCw, FlipVertical, FlipHorizontal } from "lucide-react";
import "swiper/swiper-bundle.css"
type ImageUploadProps = {
  allimages : string[]
}
const ImageUploadEditor: React.FC<ImageUploadProps> = ({allimages}) => {
  const [images, setImages] = useState<string[]>(allimages);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("Asset 001");
  const [description, setDescription] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...fileArray]);
      setSelectedImage(fileArray[0]);
    }
  };
  const handleCropImage = () => {

  }
  const handleRotateImage = () => {

  }
  const handleFlipHorizontal = () => {

  }
  const handleFlipVertical = () => {

  }
  return (
    <Modal show centered fullscreen={true} >
      <Modal.Header closeButton className="border border-0" style={{padding: "5px 20px"}}>
          <Modal.Title style={{color : "#334d6e"}}>Add Asset</Modal.Title>
      </Modal.Header>
      <Modal.Body className="row flex-nowrap" style={{ height: "90vh", overflow: "hidden" }}>
        <div className="col-9 position-relative">
          <Swiper spaceBetween={10} slidesPerView={1}>
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="position-relative">
                  <img src={img} alt={`preview-${index}`} className="img-fluid rounded sticky" style={{height: "90vh" }} />
                </div> 
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="position-absolute top-0 end-0 z-3 p-2 d-flex flex-column bg-light rounded"
          style={{margin : "5px 18px"}}
          >
              <Crop size={20} className="mb-2 cursor-pointer" onClick={handleCropImage} />
              <RotateCcw size={20} className="mb-2 cursor-pointer" onClick={handleRotateImage}/>
              <RotateCw size={20} className="mb-2 cursor-pointer" />
              <FlipVertical size={20} className="mb-2 cursor-pointer" onClick={handleFlipVertical}/>
              <FlipHorizontal size={20} className="cursor-pointer" onClick={handleFlipHorizontal}/>
          </div>
        </div>
        <div className="col-3 d-flex flex-column">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Image Name</Form.Label>
              <Form.Control 
              type="text" 
              value={imageName} 
              onChange={(e) => setImageName(e.target.value)}
              style={{ outline: "none", boxShadow: "none", borderColor : "#334d6e" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" 
              placeholder="Enter Description" 
              rows={3} value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ outline: "none", boxShadow: "none", borderColor : "#334d6e"}}
              />
            </Form.Group>
          </Form>
          <Button variant="secondary" className="w-100 bottom-0 mb-1 mt-auto" style={{backgroundColor : "#334d6e"}}>Upload Image</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImageUploadEditor;
