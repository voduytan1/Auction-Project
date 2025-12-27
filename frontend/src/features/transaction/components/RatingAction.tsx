import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

interface RatingActionProps {
  otherPartyRole: "buyer" | "seller";
  onSubmitRating: (rating: 1 | -1, comment: string) => void;
}

export function RatingAction({
  otherPartyRole,
  onSubmitRating,
}: RatingActionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState<1 | -1>(1);

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error("Vui lÃ²ng nháº­p nháº­n xÃ©t");
      return;
    }
    onSubmitRating(selectedRating, comment);
    setDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-3">
        <Alert>
          <AlertDescription>
            Đánh giá giao dịch để hoàn tất đơn hàng 
          </AlertDescription>
        </Alert>
        <Button onClick={() => setDialogOpen(true)} className="w-full">
          Đánh giá người {otherPartyRole === "buyer" ? "mua" : "bán"}
        </Button>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Đánh giá giao dịch</AlertDialogTitle>
            <AlertDialogDescription>
              Đánh giá của bạn sẽ ảnh hưởng đến uy tín của người{" "}
              {otherPartyRole === "buyer" ? "mua" : "bán"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Button
                variant={selectedRating === 1 ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedRating(1)}
              >
                <ThumbsUp className="mr-2 h-5 w-5" />
                Tốt (+1)
              </Button>
              <Button
                variant={selectedRating === -1 ? "destructive" : "outline"}
                size="lg"
                onClick={() => setSelectedRating(-1)}
              >
                <ThumbsDown className="mr-2 h-5 w-5" />
                Không tốt (-1)
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ratingComment">Nhận xét</Label>
              <Textarea
                id="ratingComment"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Để sau</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Gửi đánh giá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
