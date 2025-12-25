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
            ÄÃ¡nh giÃ¡ giao dá»‹ch Ä‘á»ƒ hoÃ n táº¥t Ä‘Æ¡n hÃ ng
          </AlertDescription>
        </Alert>
        <Button onClick={() => setDialogOpen(true)} className="w-full">
          ÄÃ¡nh giÃ¡ ngÆ°á»i {otherPartyRole === "buyer" ? "mua" : "bÃ¡n"}
        </Button>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ÄÃ¡nh giÃ¡ giao dá»‹ch</AlertDialogTitle>
            <AlertDialogDescription>
              ÄÃ¡nh giÃ¡ cá»§a báº¡n sáº½ áº£nh hÆ°á»Ÿng Ä‘áº¿n uy tÃ­n cá»§a ngÆ°á»i{" "}
              {otherPartyRole === "buyer" ? "mua" : "bÃ¡n"}
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
                Tá»‘t (+1)
              </Button>
              <Button
                variant={selectedRating === -1 ? "destructive" : "outline"}
                size="lg"
                onClick={() => setSelectedRating(-1)}
              >
                <ThumbsDown className="mr-2 h-5 w-5" />
                KhÃ´ng tá»‘t (-1)
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ratingComment">Nháº­n xÃ©t</Label>
              <Textarea
                id="ratingComment"
                placeholder="Chia sáº» tráº£i nghiá»‡m cá»§a báº¡n..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Äá»ƒ sau</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Gá»­i Ä‘Ã¡nh giÃ¡
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
