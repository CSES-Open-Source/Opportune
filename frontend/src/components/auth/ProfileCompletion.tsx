import { useEffect, useState } from "react";
import "../../styles/ProfileCompletion.css";
import { useAuth } from "../../contexts/useAuth";
import { ProgressSpinner } from "primereact/progressspinner";

const ProfileCompletion = ({
  onConfirm,
}: {
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  const { isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ProgressSpinner 
          className="h-16 w-16" 
          strokeWidth="3" 
          style={{ color: "#5b8ef4" }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 py-6">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="mb-6 relative">
          {/* Success checkmark circle */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              animationComplete ? "scale-100" : "scale-0"
            } transition-transform duration-500`}
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.15))',
              border: '2px solid #10b981'
            }}
          >
            <svg
              className={`w-12 h-12 text-[#10b981] ${
                animationComplete ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300 delay-500`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
                className={animationComplete ? "animate-draw-check" : ""}
              />
            </svg>
          </div>

          {/* Ripple effect */}
          <div
            className={`absolute top-0 left-0 w-20 h-20 rounded-full ${
              animationComplete ? "animate-ripple" : "opacity-0"
            }`}
            style={{
              background: '#10b981',
            }}
          ></div>
        </div>

        <h2
          className={`text-2xl font-bold text-[#e8eaed] mb-2 ${
            animationComplete
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          } transition-all duration-500 delay-700`}
        >
          Congratulations!
        </h2>

        <p
          className={`text-[#9ca3af] max-w-xs ${
            animationComplete
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          } transition-all duration-500 delay-900`}
        >
          {
            "Your profile is complete and you're all set to start connecting with the community."
          }
        </p>
      </div>

      <button
        className={`px-6 py-3 text-white font-semibold rounded-lg transition-all ${
          animationComplete
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        } duration-500 delay-1100`}
        style={{
          background: 'linear-gradient(135deg, #5b8ef4, #7c3aed)',
          boxShadow: '0 4px 14px rgba(91,142,244,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(91,142,244,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(91,142,244,0.3)';
        }}
        onClick={onConfirm}
      >
        Get Started
      </button>
    </div>
  );
};

export default ProfileCompletion;