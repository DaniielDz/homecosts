import { InfoIcon } from "lucide-react";

function ToolTip({ tooltipText }: { tooltipText: string }) {
    return (
        <div className="relative inline-block">
            <InfoIcon
                className="peer w-5 stroke-gray-300 hover:stroke-gray-400 cursor-pointer transition-all duration-300"
            />
            <div
                className="
                    absolute
                    bottom-full left-0
                    mb-2
                    w-48
                    bg-gray-800 text-white text-xs
                    p-2 rounded
                    hidden peer-hover:block
                    z-20
                "
            >
                {tooltipText}

                <svg
                    className="absolute top-full left-2"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <polygon points="0,0 8,0 0,8" fill="#1F2937" />
                </svg>
            </div>
        </div>
    );
}

export default ToolTip;
