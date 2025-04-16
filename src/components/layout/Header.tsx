
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, Search, LogIn, LogOut, Store } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="rtl">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-algerian-green">القائمة</h2>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <SheetClose asChild>
                      <Link to="/" className="text-lg hover:text-algerian-green transition-colors">
                        الرئيسية
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/products" className="text-lg hover:text-algerian-green transition-colors">
                        المنتجات
                      </Link>
                    </SheetClose>
                    {isAdmin && (
                      <SheetClose asChild>
                        <Link to="/admin" className="text-lg hover:text-algerian-green transition-colors">
                          لوحة التحكم
                        </Link>
                      </SheetClose>
                    )}
                    {user ? (
                      <SheetClose asChild>
                        <button
                          onClick={logout}
                          className="text-lg text-left hover:text-algerian-red transition-colors"
                        >
                          تسجيل الخروج
                        </button>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Link to="/login" className="text-lg hover:text-algerian-green transition-colors">
                          تسجيل الدخول
                        </Link>
                      </SheetClose>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center ml-2">
              <Store className="h-8 w-8 text-algerian-green" />
              <span className="text-xl font-bold tracking-tight mr-2">تيك ستور الجزائر</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl">
            <Link to="/" className="text-base font-medium hover:text-algerian-green transition-colors">
              الرئيسية
            </Link>
            <Link to="/products" className="text-base font-medium hover:text-algerian-green transition-colors">
              المنتجات
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-base font-medium hover:text-algerian-green transition-colors">
                لوحة التحكم
              </Link>
            )}
          </nav>

          {/* Search, User */}
          <div className="flex items-center space-x-2 rtl">
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Input
                type="search"
                placeholder="ابحث عن منتج..."
                className="w-[200px] lg:w-[300px] rtl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute left-0 top-0">
                <Search className="h-5 w-5" />
              </Button>
            </form>
            
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="تسجيل الخروج"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" title="تسجيل الدخول">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
