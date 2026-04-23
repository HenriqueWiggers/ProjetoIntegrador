export interface Order {
  idPedido?: number;
  nomCliente: string;
  foneCliente: string;
  foneCliente2: string;
  obsPedido: string;
  dataPedido: string;
  dataEntrega: string;
  statusPedido: string;
  preco: number;
  pago?: boolean;
  coifa?: any;
}

export const ORDER_STATUSES = ['NAO_INICIADO', 'PRODUZIDO', 'INSTALADO', 'CANCELADO'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
