import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface ProductDescriptionProps {
  description: string;
  productName: string;
}

export function ProductDescription({
  description,
//   productName,
}: ProductDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Mô tả sản phẩm
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-slate max-w-none prose-headings:font-semibold prose-h3:text-lg prose-h3:text-slate-900 prose-p:text-slate-700 prose-ul:text-slate-700 prose-li:marker:text-primary"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </CardContent>
    </Card>
  );
}
