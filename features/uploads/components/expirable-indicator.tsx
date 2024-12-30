import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import moment from "moment";

import { Clock } from "lucide-react";

export const ExpirableIndicator = ({ date }: { date: Date | null }) => {
  if (date == null) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Clock className="text-red-400" size={12} />
      </TooltipTrigger>
      <TooltipContent>Will be deleted {moment(date).fromNow()}</TooltipContent>
    </Tooltip>
  );
};
