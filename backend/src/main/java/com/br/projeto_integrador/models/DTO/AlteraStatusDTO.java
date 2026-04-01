package com.br.projeto_integrador.models.DTO;

import com.br.projeto_integrador.models.enums.StatusPedido;

public class AlteraStatusDTO {

    private Long idPedido;
    private StatusPedido statusPedido;

    public AlteraStatusDTO() {

    }

    public AlteraStatusDTO(StatusPedido statusPedido, Long id) {
        this.statusPedido = statusPedido;
        this.idPedido = id;
    }

    public StatusPedido getStatusPedido() {
        return statusPedido;
    }

    public void setStatusPedido(StatusPedido statusPedido) {
        this.statusPedido = statusPedido;
    }

    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long id) {
        this.idPedido = id;
    }
}
