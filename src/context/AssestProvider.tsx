import { createContext, useContext, useEffect, useState } from "react";
import { ImageAsset } from "../types";

interface AssetContextType {
  assets: ImageAsset[];
  addAssets: (newAssets: ImageAsset[]) => void;
  updateAsset: (updatedAsset: ImageAsset, index: number) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider = ({ children }: { children: React.ReactNode }) => {
  const [assets, setAssets] = useState<ImageAsset[]>(() => {
    const storedAssets = localStorage.getItem("assets");
    return storedAssets ? JSON.parse(storedAssets) : [];
  });

  const addAssets = (newAssets: ImageAsset[]) => {
    const updatedAssets = [...assets, ...newAssets];
    setAssets(updatedAssets);
    localStorage.setItem("assets", JSON.stringify(updatedAssets));
  };

  const updateAsset = (updatedAsset: ImageAsset, index: number) => {
    const updatedAssets = [...assets];
    if (index >= 0 && index < updatedAssets.length) {
      updatedAssets[index] = updatedAsset;
      setAssets(updatedAssets);
      localStorage.setItem("assets", JSON.stringify(updatedAssets));
    }
  };

  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.removeItem("assets");
      setAssets([]);
    };

    window.addEventListener("beforeunload", clearLocalStorage);
    return () => window.removeEventListener("beforeunload", clearLocalStorage);
  }, []);

  return (
    <AssetContext.Provider value={{ assets, addAssets, updateAsset }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (!context) throw new Error("useAssets must be used within an AssetProvider");
  return context;
};