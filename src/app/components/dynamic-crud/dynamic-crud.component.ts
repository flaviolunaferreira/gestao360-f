import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldConfig, DynamicTableConfig } from '../../interface/Field-config.model';

@Component({
  selector: 'app-dynamic-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-crud.component.html',
  styleUrls: ['./dynamic-crud.component.scss']
})
export class DynamicCrudComponent implements OnInit {
  @Input() config?: DynamicTableConfig;
  @Input() initialData: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;
  
  @Output() onCreate = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<{id: number, data: any}>();
  @Output() onRemove = new EventEmitter<number>();
  @Output() onLoadData = new EventEmitter<void>();
  @Output() onView = new EventEmitter<any>();
  
  form!: FormGroup;
  data: any[] = [];
  isEditMode = false;
  currentEditId: number | null = null;
  filterForm!: FormGroup;
  filteredData: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.config) {
      this.initForms();
      this.data = [...this.initialData];
      this.applyFilters();
    }
  }

  private initForms(): void {
    // Inicializa o formulário principal
    const formGroup: any = {};
    this.config!.fields.forEach(field => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.minLength) validators.push(Validators.minLength(field.minLength));
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      if (field.minValue) validators.push(Validators.min(field.minValue));
      if (field.maxValue) validators.push(Validators.max(field.maxValue));
      if (field.pattern) validators.push(Validators.pattern(field.pattern));
      
      formGroup[field.name] = [field.defaultValue || '', validators];
    });
    this.form = this.fb.group(formGroup);

    // Inicializa o formulário de filtro
    const filterGroup: any = {};
    this.config!.fields
      .filter(field => field.filterable)
      .forEach(field => {
        filterGroup[field.name] = [''];
      });
    this.filterForm = this.fb.group(filterGroup);
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    if (!this.filterForm) return;
    
    const filterValues = this.filterForm.value;
    this.filteredData = this.data.filter(item => {
      return Object.keys(filterValues).every(key => {
        if (!filterValues[key]) return true;
        return String(item[key]).toLowerCase().includes(String(filterValues[key]).toLowerCase());
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = this.form.value;
    
    if (this.isEditMode && this.currentEditId !== null) {
      this.onUpdate.emit({id: this.currentEditId, data: formData});
    } else {
      this.onCreate.emit(formData);
    }

    this.resetForm();
  }

  onEdit(item: any): void {
    this.isEditMode = true;
    this.currentEditId = item.id;
    this.form.patchValue(item);
  }

  onDelete(item: any): void {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      this.onRemove.emit(item.id);
    }
  }

  resetForm(): void {
    this.form.reset();
    this.isEditMode = false;
    this.currentEditId = null;
  }

  refreshData(): void {
    this.data = [...this.initialData];
    this.applyFilters();
  }

  get tableFields(): FieldConfig[] {
    return this.config?.fields.filter(field => field.showInTable) || [];
  }

  get filterFields(): FieldConfig[] {
    return this.config?.fields.filter(field => field.filterable) || [];
  }

  getFieldSizeClass(field: FieldConfig): string {
    // Campos textarea sempre ocupam linha completa
    if (field.type === 'textarea') return 'form-field full-width';
  
    // Campos sem maxLength assumem tamanho médio
    if (!field.maxLength) return 'form-field md-field';
  
    // Lógica de tamanho baseada em maxLength
    const length = field.maxLength;
    
    if (length <= 15) return 'form-field xs-field';
    if (length <= 30) return 'form-field sm-field';
    if (length <= 50) return 'form-field md-field';
    if (length <= 100) return 'form-field lg-field';
    return 'form-field xl-field';
  }
}