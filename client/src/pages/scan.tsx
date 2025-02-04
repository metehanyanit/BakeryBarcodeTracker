import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scan as ScanIcon } from "lucide-react";

export default function Scan() {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);

  const { data: product } = useQuery<Product>({
    queryKey: [`/api/products/barcode/${barcode}`, barcode],
    enabled: barcode.length > 0,
  });

  const simulateScan = () => {
    setScanning(true);
    // Simulate scanning delay and randomly pick one of the sample barcodes
    setTimeout(() => {
      setBarcode(Math.random() > 0.5 ? "123456789" : "987654321");
      setScanning(false);
    }, 1500);
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
              onClick={simulateScan}
              disabled={scanning}
              className="bg-[#F9A825] hover:bg-[#F57F17] text-white"
            >
              <ScanIcon className="w-4 h-4 mr-2" />
              {scanning ? "Scanning..." : "Scan"}
            </Button>
          </div>
          <div
            className={`h-48 border-2 border-dashed rounded-lg flex items-center justify-center ${
              scanning ? "border-[#F9A825] animate-pulse" : "border-gray-200"
            }`}
          >
            {scanning ? (
              <span className="text-[#F9A825]">Scanning...</span>
            ) : (
              <span className="text-gray-500">Scanner View</span>
            )}
          </div>
        </CardContent>
      </Card>

      {product && <ProductCard product={product} />}
    </div>
  );
}
