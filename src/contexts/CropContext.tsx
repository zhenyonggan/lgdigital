"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Crop = 'rice' | 'wheat';

interface CropContextType {
  crop: Crop;
  setCrop: (crop: Crop) => void;
}

const CropContext = createContext<CropContextType | undefined>(undefined);

export function CropProvider({ children }: { children: ReactNode }) {
  const [crop, setCrop] = useState<Crop>('rice');

  return (
    <CropContext.Provider value={{ crop, setCrop }}>
      {children}
    </CropContext.Provider>
  );
}

export function useCrop() {
  const context = useContext(CropContext);
  if (context === undefined) {
    throw new Error('useCrop must be used within a CropProvider');
  }
  return context;
}
