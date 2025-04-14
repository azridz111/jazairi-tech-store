
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, PackageCheck, PackageX } from 'lucide-react';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AdminProductListProps {
  products: Product[];
  onDelete: (id: number) => void;
  onToggleStock: (id: number, inStock: boolean) => void;
}

const AdminProductList = ({ products, onDelete, onToggleStock }: AdminProductListProps) => {
  const navigate = useNavigate();
  
  const handleEdit = (id: number) => {
    navigate(`/admin/products/edit/${id}`);
  };
  
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="rtl">الصورة</TableHead>
            <TableHead className="rtl">اسم المنتج</TableHead>
            <TableHead className="rtl">الفئة</TableHead>
            <TableHead className="rtl">السعر</TableHead>
            <TableHead className="rtl">المخزون</TableHead>
            <TableHead className="rtl">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded" 
                />
              </TableCell>
              <TableCell className="font-medium rtl">{product.name}</TableCell>
              <TableCell className="rtl">
                {product.category === 'laptops' && 'أجهزة محمولة'}
                {product.category === 'desktops' && 'أجهزة مكتبية'}
                {product.category === 'accessories' && 'ملحقات'}
                {product.category === 'components' && 'مكونات'}
              </TableCell>
              <TableCell className="rtl">{product.price.toLocaleString()} د.ج</TableCell>
              <TableCell>
                {product.inStock 
                  ? <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 rtl">
                      <PackageCheck className="w-3 h-3 ml-1" /> متوفر
                    </span>
                  : <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 rtl">
                      <PackageX className="w-3 h-3 ml-1" /> غير متوفر
                    </span>
                }
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 rtl">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(product.id)}
                    className="sm:mr-2"
                  >
                    <Edit className="w-4 h-4 ml-1" /> تعديل
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-algerian-green border-algerian-green hover:bg-algerian-green/10"
                    onClick={() => onToggleStock(product.id, !product.inStock)}
                  >
                    {product.inStock 
                      ? <><PackageX className="w-4 h-4 ml-1" /> نفذ</>
                      : <><PackageCheck className="w-4 h-4 ml-1" /> توفر</>
                    }
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-algerian-red border-algerian-red hover:bg-algerian-red/10"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4 ml-1" /> حذف
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 rtl">
                لا توجد منتجات لعرضها
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminProductList;
