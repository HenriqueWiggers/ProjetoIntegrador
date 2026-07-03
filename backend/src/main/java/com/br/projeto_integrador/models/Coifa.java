package com.br.projeto_integrador.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

import java.io.Serializable;


@Entity
@Table(name="coifa")
@JsonPropertyOrder({"idCoifa","largura","comprimento","altura","bocaLargura","bocaProfundidade","bocalPosX","bocalPosY"})
public class Coifa implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    private Long idCoifa;  // derived from pedido via @MapsId — no auto-generation
    private Double largura;
    private Double comprimento;
    private Double altura;
    private Double bocaLargura;
    private Double bocaProfundidade;
    private Double bocalPosX;   // deslocamento lateral (Lado)
    private Double bocalPosY;   // deslocamento em profundidade (Cima)

    @OneToOne
    @MapsId
    @JsonIgnoreProperties("coifa")
    private Pedido pedido;

    public Coifa() {
    }

    public Coifa(Long id, Double largura, Double comprimento, Double altura,
                 Double bocaLargura, Double bocaProfundidade,
                 Double bocalPosX, Double bocalPosY) {
        this.idCoifa = id;
        this.largura = largura;
        this.comprimento = comprimento;
        this.altura = altura;
        this.bocaLargura = bocaLargura;
        this.bocaProfundidade = bocaProfundidade;
        this.bocalPosX = bocalPosX;
        this.bocalPosY = bocalPosY;
    }

    public Long getIdCoifa() { return idCoifa; }
    public void setIdCoifa(Long id) { this.idCoifa = id; }

    public Double getLargura() { return largura; }
    public void setLargura(Double largura) { this.largura = largura; }

    public Double getComprimento() { return comprimento; }
    public void setComprimento(Double comprimento) { this.comprimento = comprimento; }

    public Double getAltura() { return altura; }
    public void setAltura(Double altura) { this.altura = altura; }

    public Double getBocaLargura() { return bocaLargura; }
    public void setBocaLargura(Double bocaLargura) { this.bocaLargura = bocaLargura; }

    public Double getBocaProfundidade() { return bocaProfundidade; }
    public void setBocaProfundidade(Double bocaProfundidade) { this.bocaProfundidade = bocaProfundidade; }

    public Double getBocalPosX() { return bocalPosX; }
    public void setBocalPosX(Double bocalPosX) { this.bocalPosX = bocalPosX; }

    public Double getBocalPosY() { return bocalPosY; }
    public void setBocalPosY(Double bocalPosY) { this.bocalPosY = bocalPosY; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
}
