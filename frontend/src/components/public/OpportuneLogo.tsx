import React from "react";

const OpportuneLogo = ({
  size = "md",
  variant = "gradient",
  showText = true,
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "gradient" | "primary";
  showText?: boolean;
  className?: string;
}) => {
  const sizeClasses = {
    sm: {
      container: "h-8",
      icon: "w-8 h-8",
      text: "text-lg",
      gap: "gap-2",
      person: "w-3 h-5",
      head: "w-2 h-2",
      body: "w-3 h-2.5",
      line: "h-0.5",
    },
    md: {
      container: "h-12",
      icon: "w-10 h-10",
      text: "text-2xl",
      gap: "gap-3",
      person: "w-4 h-6",
      head: "w-2.5 h-2.5",
      body: "w-4 h-3",
      line: "h-0.5",
    },
    lg: {
      container: "h-16",
      icon: "w-14 h-12",
      text: "text-3xl",
      gap: "gap-4",
      person: "w-5 h-8",
      head: "w-3 h-3",
      body: "w-5 h-4",
      line: "h-1",
    },
    xl: {
      container: "h-20",
      icon: "w-16 h-16",
      text: "text-4xl",
      gap: "gap-5",
      person: "w-6 h-10",
      head: "w-4 h-4",
      body: "w-6 h-5",
      line: "h-1",
    },
  };

  const variantClasses = {
    gradient: {
      student: "bg-indigo-500",
      alumni: "bg-purple-600",
      line: "bg-gradient-to-r from-indigo-500 to-purple-600",
      text: "bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent",
    },
    primary: {
      student: "bg-primary",
      alumni: "bg-primary",
      line: "bg-primary",
      text: "text-primary",
    },
  };

  const sizes = sizeClasses[size];
  const colors = variantClasses[variant];

  return (
    <div className={`flex items-center ${sizes.gap} ${className}`}>
      {/* People Bridge Icon */}
      <div
        className={`${sizes.icon} relative flex items-center justify-center`}
      >
        {/* Student (Left Person) */}
        <div
          className={`${sizes.person} absolute left-0 top-1/2 transform -translate-y-1/2`}
        >
          {/* Student Head */}
          <div
            className={`${sizes.head} ${colors.student} rounded-full mx-auto mb-0.5`}
          />
          {/* Student Body */}
          <div className={`${sizes.body} ${colors.student} rounded-t-full`} />
        </div>

        {/* Alumni (Right Person) */}
        <div
          className={`${sizes.person} absolute right-0 top-1/2 transform -translate-y-1/2`}
        >
          {/* Alumni Head */}
          <div
            className={`${sizes.head} ${colors.alumni} rounded-full mx-auto mb-0.5`}
          />
          {/* Alumni Body */}
          <div className={`${sizes.body} ${colors.alumni} rounded-t-full`} />
        </div>

        {/* Connection Line */}
        <div
          className={`${colors.line} ${sizes.line} absolute top-1/2 transform -translate-y-1/2`}
          style={{
            left:
              size === "sm"
                ? "10px"
                : size === "md"
                ? "14px"
                : size === "lg"
                ? "20px"
                : "24px",
            right:
              size === "sm"
                ? "10px"
                : size === "md"
                ? "14px"
                : size === "lg"
                ? "20px"
                : "24px",
          }}
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`font-bold ${sizes.text} ${colors.text}`}>
          Opportune
        </span>
      )}
    </div>
  );
};

export default OpportuneLogo;
