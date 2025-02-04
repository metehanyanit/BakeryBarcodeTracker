import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X } from "lucide-react";
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function Scan() {
  const [barcode, setBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader>();

  const { data: product } = useQuery<Product>({
    queryKey: [`/api/products/barcode/${barcode}`, barcode],
    enabled: barcode.length > 0,
  });

  useEffect(() => {
    // Initialize the code reader
    codeReader.current = new BrowserMultiFormatReader();

    // Cleanup on component unmount
    return () => {
      if (codeReader.current && isScanning) {
        codeReader.current.reset();
        setIsScanning(false);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      if (!codeReader.current) return;
      setIsScanning(true);

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (!devices?.length) {
        throw new Error('No camera found');
      }

      const selectedDeviceId = devices[0].deviceId;
      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result) => {
          if (result) {
            setBarcode(result.getText());
            stopScanning();
          }
        }
      );
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-josefin-sans text-[#3E2723]">
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter barcode manually..."
              className="flex-1"
            />
            <Button
              onClick={isScanning ? stopScanning : startScanning}
              className="bg-[#F9A825] hover:bg-[#F57F17] text-white"
            >
              {isScanning ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </>
              )}
            </Button>
          </div>
          <div
            className={`relative h-48 border-2 border-dashed rounded-lg overflow-hidden ${
              isScanning ? 'border-[#F9A825]' : 'border-gray-200'
            }`}
          >
            {isScanning ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">
                  Click "Start Camera" to scan barcode
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {product && <ProductCard product={product} />}
    </div>
  );
}