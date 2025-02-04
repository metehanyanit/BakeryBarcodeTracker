import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, Plus, Scan as ScanIcon } from "lucide-react";
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Scan() {
  const [barcode, setBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader>();
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: product, error } = useQuery<Product>({
    queryKey: [`/api/products/barcode/${barcode}`, barcode],
    enabled: barcode.length > 0,
  });

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDeviceId }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }

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
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please ensure camera permissions are granted.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleAddProduct = () => {
    setLocation(`/add?barcode=${encodeURIComponent(barcode)}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-josefin-sans text-[#3E2723] flex items-center gap-2">
            <ScanIcon className="h-5 w-5" />
            Scan Barcode
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
                  Scan
                </>
              )}
            </Button>
          </div>
          <div className={`relative h-[calc(100vh-20rem)] border-2 border-dashed rounded-lg overflow-hidden ${
            isScanning ? 'border-[#F9A825]' : 'border-gray-200'
          }`}>
            {isScanning ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">
                  Click "Scan" to start scanning
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {error && barcode && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <p className="text-orange-800 mb-4">Product not found. Would you like to add it?</p>
              <Button
                onClick={handleAddProduct}
                className="w-full bg-[#F9A825] hover:bg-[#F57F17] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </CardContent>
          </Card>
        )}

        {product && <ProductCard product={product} />}
      </div>
    </div>
  );
}