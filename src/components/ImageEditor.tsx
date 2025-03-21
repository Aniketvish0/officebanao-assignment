import React, { useState, useRef, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Crop, RotateCcw, RotateCw, FlipVertical, FlipHorizontal, RefreshCcw, Upload } from "lucide-react";
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import "swiper/swiper-bundle.css";
import { ImageAsset } from "../types";
import { useAssets } from "../context/AssestProvider";

type ImageEditorProps = {
  allImages: ImageAsset[];
  initialIndex: number;
  onClose: () => void;
};

const ImageEditor: React.FC<ImageEditorProps> = ({ allImages, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [imageName, setImageName] = useState(allImages[initialIndex]?.name || "");
  const [description, setDescription] = useState(allImages[initialIndex]?.description || "");
  
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  
  const [currentImages, setCurrentImages] = useState<ImageAsset[]>(allImages);
  
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  
  const { updateAsset } = useAssets();
  
  const applyTransformationsToImage = useCallback(() => {
    if (!imgRef.current || !canvasRef.current) return;
    
    const image = imgRef.current;
    const canvas = canvasRef.current;
    
    // Determine dimensions based on rotation
    const isRotated90or270 = Math.abs(rotation % 180) === 90;
    const canvasWidth = isRotated90or270 ? image.naturalHeight : image.naturalWidth;
    const canvasHeight = isRotated90or270 ? image.naturalWidth : image.naturalHeight;
    
    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Move to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply transformations
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    
    if (flipH || flipV) {
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    }
    
    // Calculate drawing dimensions and position
    const drawWidth = image.naturalWidth;
    const drawHeight = image.naturalHeight;
    
    // Draw from center
    ctx.drawImage(
      image,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    
    // Convert to blob and update
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const blobUrl = URL.createObjectURL(blob);
      
      const updatedImages = [...currentImages];
      updatedImages[currentIndex] = {
        ...updatedImages[currentIndex],
        src: blobUrl,
        name: imageName,
        description: description
      };
      setCurrentImages(updatedImages);
      
      updateAsset(updatedImages[currentIndex], currentIndex);
      
      // Reset transformation values after applying them
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      
    }, 'image/jpeg', 0.95);
    
  }, [imgRef, canvasRef, rotation, flipH, flipV, currentImages, currentIndex, imageName, description, updateAsset]);
  const handleCompleteCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;
    
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const scaleX = image.naturalWidth/image.width;
    const scaleY = image.naturalHeight/image.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI)/180);
    }
    
    if (flipH || flipV) {
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    }
    
    ctx.translate(-canvas.width/2, -canvas.height/2);
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    
    ctx.restore();
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const blobUrl = URL.createObjectURL(blob);
      
      const updatedImages = [...currentImages];
      updatedImages[currentIndex] = {
        ...updatedImages[currentIndex],
        src: blobUrl,
        name: imageName,
        description: description
      };
      setCurrentImages(updatedImages);
      
      updateAsset(updatedImages[currentIndex], currentIndex);
      
      setIsCropping(false);
      setCompletedCrop(null);
      setCrop(undefined);
      
      // Reset transformation values after applying them
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      
    }, 'image/jpeg', 0.95);
    
  }, [completedCrop, imgRef, canvasRef, rotation, flipH, flipV, currentImages, currentIndex, imageName, description, updateAsset]);

  const handleCropImage = () => {
    if (isCropping && completedCrop) {
      handleCompleteCrop();
    } else {
      setIsCropping(true);
    }
  };
  
  const handleRotateAntiClockWise = () => {
    setRotation((prev) => (prev - 90) % 360);
  };
  
  const handleRotateClockWise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };
  
  const handleFlipHorizontal = () => {
    setFlipH((prev) => !prev);
  };
  
  const handleFlipVertical = () => {
    setFlipV((prev) => !prev);
  };
  
  const handleReplaceImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const updatedImages = [...currentImages];
          updatedImages[currentIndex] = {
            ...updatedImages[currentIndex],
            src: reader.result as string,
            name: imageName,
            description: description
          };
          setCurrentImages(updatedImages);
          updateAsset(updatedImages[currentIndex], currentIndex);
          
          // Reset transformations when replacing image
          setRotation(0);
          setFlipH(false);
          setFlipV(false);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };
  
  const handleSaveChanges = () => {
    // If we have transformations to apply, do that first
    if (rotation !== 0 || flipH || flipV) {
      applyTransformationsToImage();
    } else {
      // Otherwise just update the metadata
      const updatedImage = {
        ...currentImages[currentIndex],
        name: imageName,
        description: description,
      };
      const updatedImages = [...currentImages];
      updatedImages[currentIndex] = updatedImage;
      setCurrentImages(updatedImages);
      updateAsset(updatedImage, currentIndex);
    }
    onClose();
  };
  
  const handleCancelCrop = () => {
    setIsCropping(false);
    setCompletedCrop(null);
    setCrop(undefined);
  };
  
  return (
    <Modal show centered fullscreen={true} onHide={onClose}>
      <Modal.Header closeButton className="border border-0" style={{ padding: "5px 20px" }}>
        <Modal.Title style={{ color: "#334d6e" }}>
          {isCropping ? "Crop Image" : "Add Asset"}
        </Modal.Title>
        {isCropping && (
          <div className="ms-auto me-3">
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="me-2"
              onClick={handleCancelCrop}
            >
              Cancel
            </Button>
            <Button 
              variant="outline-success" 
              size="sm"
              onClick={handleCompleteCrop}
              disabled={!completedCrop}
            >
              Apply Crop
            </Button>
          </div>
        )}
      </Modal.Header>
      <Modal.Body className="row flex-nowrap" style={{ height: "90vh", overflow: "hidden" }}>
        <div className="col-9 position-relative">
          {!isCropping ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              initialSlide={initialIndex}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setCurrentIndex(swiper.activeIndex);
                setImageName(currentImages[swiper.activeIndex]?.name || "");
                setDescription(currentImages[swiper.activeIndex]?.description || "");
                setRotation(0);
                setFlipH(false);
                setFlipV(false);
              }}
            >
              {currentImages.map((img, index) => (
                <SwiperSlide key={`slide-${index}`}>
                  <div className="position-relative">
                    <img
                      ref={index === currentIndex ? imgRef : null}
                      src={img.src}
                      alt={`preview-${index}`}
                      className="img-fluid rounded"
                      style={{ 
                        height: "90vh", 
                        width: "100%", 
                        objectFit: "contain",
                        transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                        transformOrigin: "center"
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="position-relative">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={currentImages[currentIndex].src}
                  alt={`preview-${currentIndex}`}
                  className="img-fluid rounded"
                  style={{ 
                    height: "90vh", 
                    width: "100%", 
                    objectFit: "contain",
                    transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                    transformOrigin: "center"
                  }}
                />
              </ReactCrop>
            </div>
          )}
          
          <div className="position-absolute top-0 end-0 z-3 p-2 d-flex flex-column bg-light rounded"
            style={{ margin: "5px 18px" }}>
            <Crop 
              size={20} 
              className={`mb-2 cursor-pointer ${isCropping ? 'text-primary' : ''}`} 
              onClick={handleCropImage} 
              style={{ cursor: 'pointer' }}
            />
            <RotateCcw 
              size={20} 
              className="mb-2 cursor-pointer" 
              onClick={handleRotateAntiClockWise} 
              style={{ cursor: 'pointer' }}
            />
            <RotateCw 
              size={20} 
              className="mb-2 cursor-pointer" 
              onClick={handleRotateClockWise} 
              style={{ cursor: 'pointer' }}
            />
            <FlipVertical 
              size={20} 
              className="mb-2 cursor-pointer" 
              onClick={handleFlipVertical} 
              style={{ cursor: 'pointer' }}
            />
            <FlipHorizontal 
              size={20} 
              className="mb-2 cursor-pointer" 
              onClick={handleFlipHorizontal} 
              style={{ cursor: 'pointer' }}
            />
            <RefreshCcw 
              size={20} 
              className="cursor-pointer" 
              onClick={handleReplaceImage} 
              style={{ cursor: 'pointer' }}
            />
          </div>
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </div>
        
        <div className="col-3 d-flex flex-column">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Image Name</Form.Label>
              <Form.Control
                type="text"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                style={{ outline: "none", boxShadow: "none", borderColor: "#334d6e" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ outline: "none", boxShadow: "none", borderColor: "#334d6e" }}
              />
            </Form.Group>
          </Form>
          <Button 
            variant="secondary" 
            className="w-100 bottom-0 mb-1 mt-auto d-flex align-items-center justify-content-center gap-2" 
            style={{ backgroundColor: "#334d6e" }}
            onClick={handleSaveChanges}
          >
            <Upload size={20}/> Upload
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImageEditor;