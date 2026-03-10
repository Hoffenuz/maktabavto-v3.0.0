import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto rounded-2xl bg-accent flex items-center justify-center mb-6">
        <span className="text-4xl font-extrabold text-primary">404</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Sahifa topilmadi</h1>
      <p className="text-muted-foreground mb-6">Bu sahifa mavjud emas yoki o'chirilgan</p>
      <Link to="/">
        <Button className="gap-2 rounded-xl shadow-md shadow-primary/20">
          <Home className="w-4 h-4" />
          Bosh sahifaga qaytish
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
