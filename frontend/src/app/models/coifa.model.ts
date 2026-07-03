export interface Coifa {
  idCoifa?: number;
  largura: number;
  comprimento: number;       // profundidade da base
  altura: number;
  bocaLargura: number;       // largura da abertura superior
  bocaProfundidade: number;  // profundidade da abertura superior
  bocalPosX: number;         // deslocamento lateral (Lado)
  bocalPosY: number;         // deslocamento em profundidade (Cima)
  pedido?: { idPedido: number };
}
