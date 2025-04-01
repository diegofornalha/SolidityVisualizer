import { CopyButton } from "./copy-button";
import { Image } from "lucide-react";
import { ActionButton } from "./action-button";

interface ExportDropdownProps {
  onCopy: () => void;
  lastGenerated: Date;
  onExportImage: () => void;
  isOpen: boolean;
  loading?: boolean;
}

export function ExportDropdown({
  onCopy,
  lastGenerated,
  onExportImage,
  loading = false,
}: ExportDropdownProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <ActionButton
          onClick={onExportImage}
          icon={Image}
          tooltipText="Download diagram as high-quality PNG"
          text="Download PNG"
          loading={loading}
        />
        <CopyButton onClick={onCopy} loading={loading} />
      </div>

      <div className="flex items-center">
        <span className="text-sm text-gray-700">
          Last generated: {lastGenerated.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
