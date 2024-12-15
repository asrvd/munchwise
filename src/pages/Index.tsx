import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-2xl"
      >
        <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200/90">
          Your Personal Nutrition Assistant
        </span>

        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight">
          Track your nutrition journey with AI precision
        </h1>

        <p className="text-xl text-gray-600 max-w-lg mx-auto">
          Log meals in natural language, track calories effortlessly, and
          achieve your health goals with personalized insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => navigate("/sign-up")}
            className="bg-primary hover:bg-primary/90 text-base max-w-max"
          >
            Start tracking now!
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-200/50 card-hover"
          >
            <div className="w-12 h-12 bg-orange-100 border border-orange-200/50 rounded-xl flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const features = [
  {
    title: "Natural Language Logging",
    description: "Log your meals in plain English - our AI handles the calculations.",
    icon: <span className="text-2xl">🗣️</span>,
  },
  {
    title: "Smart Goal Setting",
    description: "Get personalized calorie goals based on your metrics and goals.",
    icon: <span className="text-2xl">🎯</span>,
  },
  {
    title: "Visual Analytics",
    description: "Track your progress with beautiful, interactive charts and insights.",
    icon: <span className="text-2xl">📊</span>,
  },
];

export default Index;