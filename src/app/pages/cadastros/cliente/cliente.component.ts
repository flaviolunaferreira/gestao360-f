import { Component, OnInit, inject, signal } from '@angular/core';
import { ClienteService } from '../../../service/cadastro/Cliente/Cliente.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente, CreateClienteDTO, UpdateClienteDTO } from '../../../interface/cadastro/Cliente';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../service/toast/toast.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

  clientes = signal<Cliente[]>([]);
  loading = signal(false);
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);

  clienteForm = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    cpfCnpj: ['', [Validators.required, Validators.pattern(/^\d{11}|\d{14}$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
    endereco: ['', [Validators.required, Validators.maxLength(200)]]
  });

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  async loadClientes() {
    this.loading.set(true);
    try {
      this.clienteService.getAll().subscribe(clientes => {
        this.clientes.set(clientes);
      });
    } catch (error) {
      this.showError('Erro ao carregar clientes');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(cliente: Cliente) {
    this.currentEditId.set(cliente.id);
    this.isEditing.set(true);
    this.clienteForm.patchValue({
      nome: cliente.nome,
      cpfCnpj: cliente.cpfCnpj,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco
    });
  }

  cancelEdit() {
    this.currentEditId.set(null);
    this.isEditing.set(false);
    this.clienteForm.reset();
  }

  async onSubmit() {
    if (this.clienteForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = this.clienteForm.value;

      if (this.isEditing() && this.currentEditId()) {
        await this.clienteService.update(this.currentEditId()!, formData as UpdateClienteDTO);
        this.showSuccess('Cliente atualizado com sucesso');
      } else {
        await this.clienteService.create(formData as CreateClienteDTO);
        this.showSuccess('Cliente criado com sucesso');
      }

      this.cancelEdit();
      this.loadClientes();
    } catch (error) {
      this.showError('Erro ao salvar cliente');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCliente(id: string) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await this.clienteService.delete(id);
        this.showSuccess('Cliente excluído com sucesso');
        this.loadClientes();
      } catch (error) {
        this.showError('Erro ao excluir cliente');
      }
    }
  }

  private showSuccess(message: string) {
    this.toast.show(message, 'Sucesso');
  }

  private showError(message: string) {
    this.toast.show(message, 'Erro!');
  }
}