import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddAssestButton = () => {
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isUploaded, setIsUploaded] = useState(false);

    const handleUploadAssest = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/jpeg, image/png, image/jpg";
        input.multiple = true;
        input.onchange = (event: Event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                const fileNames = Array.from(files).map(file => URL.createObjectURL(file));
                setSelectedImages(fileNames);
                setIsUploaded(true);  
            }
        };
        input.click();
    };

    useEffect(() => {
        if (isUploaded && selectedImages.length > 0) {
            navigate('/gallery', { state: { images: selectedImages } });
        }
    }, [isUploaded, selectedImages, navigate]);

    return (
        <div>
            <Button 
                variant="primary" 
                className="upload-button" 
                style={{ display: "flex", backgroundColor: "#334d6e" }}
                onClick={handleUploadAssest}
            >
                <Plus />
                Add
            </Button>
        </div>
    );
};

export default AddAssestButton;
