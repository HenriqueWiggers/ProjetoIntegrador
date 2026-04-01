package com.br.projeto_integrador.repositories;

import com.br.projeto_integrador.models.Pedido;
import com.br.projeto_integrador.models.enums.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByStatusPedido(StatusPedido status);

}
