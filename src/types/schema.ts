export interface ColumnDef {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeignKey?: boolean;
  references?: string;
  nullable: boolean;
  defaultVal?: string;
  descriptionKu: string;
}

export interface TableDef {
  name: string;
  nameKu: string;
  category: 'core' | 'products' | 'inventory' | 'sales' | 'purchases' | 'finance' | 'system';
  categoryKu: string;
  descriptionKu: string;
  columns: ColumnDef[];
  indexes: string[];
}

export interface BranchDef {
  id: number;
  code: string;
  nameKu: string;
  nameEn: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  manager: string;
  isActive: boolean;
  specialtyKu: string;
}

export interface PermissionDef {
  id: number;
  module: string;
  code: string;
  nameKu: string;
  superAdmin: boolean;
  branchManager: boolean;
  cashier: boolean;
  inventoryStaff: boolean;
}

export interface CategorySeedDef {
  id: number;
  nameKu: string;
  nameEn: string;
  code: string;
  icon: string;
  descriptionKu: string;
  subcategories: string[];
}
