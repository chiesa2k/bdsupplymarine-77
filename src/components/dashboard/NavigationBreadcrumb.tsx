import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
  onReset: () => void;
}

export const NavigationBreadcrumb = ({ items, onReset }: NavigationBreadcrumbProps) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow-card border">
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-primary hover:bg-primary/10"
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {items.length > 0 && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.onClick ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={item.onClick}
                  className="text-primary hover:bg-primary/10 px-2 py-1 h-auto font-medium"
                >
                  {item.label}
                </Button>
              ) : (
                <span className="text-sm font-medium text-foreground px-2 py-1">
                  {item.label}
                </span>
              )}
              
              {index < items.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};