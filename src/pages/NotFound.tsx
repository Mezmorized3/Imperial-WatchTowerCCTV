
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-scanner-dark text-white">
      <div className="text-center p-8 bg-scanner-card rounded-lg border border-gray-800 shadow-lg max-w-lg">
        <h1 className="text-6xl font-bold mb-4 text-scanner-primary">404</h1>
        <p className="text-xl mb-6">Page Not Found</p>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
          <br />
          <span className="font-mono text-xs bg-gray-800 px-2 py-1 mt-2 inline-block rounded">
            {location.pathname}
          </span>
        </p>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
