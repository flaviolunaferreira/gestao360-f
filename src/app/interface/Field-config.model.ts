export interface FieldConfig {
    name: string;
    label: string;
    type: 'input' | 'dropdown' | 'checkbox' | 'date' | 'textarea';
    dataType: 'string' | 'number' | 'boolean' | 'enum' | 'date';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    options?: string[]; // Para dropdown
    showInTable?: boolean;
    showInForm?: boolean;
    filterable?: boolean;
    defaultValue?: any;
    mask?: string; // Para input com máscara;
  }
  
  export interface ActionConfig {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
  }
  
  export interface DynamicTableConfig {
    fields: FieldConfig[];
    actions?: ActionConfig;
    title?: string; // Adicionando título opcional
  }