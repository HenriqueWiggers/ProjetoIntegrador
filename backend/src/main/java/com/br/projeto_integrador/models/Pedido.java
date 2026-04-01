package com.br.projeto_integrador.models;

import com.br.projeto_integrador.models.enums.StatusPedido;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "pedido")
public class Pedido implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPedido;

    private String nomCliente;
    private String foneCliente;
    private String foneCliente2;
    private String obsPedido;
    private LocalDate dataPedido;
    private LocalDate dataEntrega;
    private StatusPedido statusPedido;
    private Double preco;


    @OneToOne(mappedBy = "pedido" , cascade = CascadeType.ALL)
    private Coifa coifa;

    public Pedido() {
    }

    public Pedido(Long idPedido, String nomCliente, String foneCliente, String foneCliente2, String obsPedido, LocalDate dataPedido, LocalDate dataEntrega, StatusPedido statusPedido, Double preco) {
        this.idPedido = idPedido;
        this.nomCliente = nomCliente;
        this.foneCliente = foneCliente;
        this.foneCliente2 = foneCliente2;
        this.obsPedido = obsPedido;
        this.dataPedido = dataPedido;
        this.dataEntrega = dataEntrega;
        this.statusPedido = statusPedido;
        this.preco = preco;
    }

    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    public String getNomCliente() {
        return nomCliente;
    }

    public void setNomCliente(String nomCliente) {
        this.nomCliente = nomCliente;
    }

    public String getFoneCliente() {
        return foneCliente;
    }

    public void setFoneCliente(String foneCliente) {
        this.foneCliente = foneCliente;
    }

    public String getFoneCliente2() {
        return foneCliente2;
    }

    public void setFoneCliente2(String foneCliente2) {
        this.foneCliente2 = foneCliente2;
    }

    public String getObsPedido() {
        return obsPedido;
    }

    public void setObsPedido(String obsPedido) {
        this.obsPedido = obsPedido;
    }

    public LocalDate getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDate dataPedido) {
        this.dataPedido = dataPedido;
    }

    public LocalDate getDataEntrega() {
        return dataEntrega;
    }

    public void setDataEntrega(LocalDate dataEntrega) {
        this.dataEntrega = dataEntrega;
    }

    public StatusPedido getStatusPedido() {
        return statusPedido;
    }

    public void setStatusPedido(StatusPedido statusPedido) {
        this.statusPedido = statusPedido;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public Coifa getCoifa() {
        return coifa;
    }

    public void setCoifa(Coifa coifa) {
        this.coifa = coifa;
    }



    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Pedido pedido)) return false;
        return Objects.equals(getIdPedido(), pedido.getIdPedido());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getIdPedido());
    }
}
