package com.br.projeto_integrador.models;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="coifa")
@JsonPropertyOrder({"idCoifa","largura","altura","comprimento","bocalPosX","bocalPosY"})
public class Coifa implements Serializable{
    private static final long serialVersionUID = 1L;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCoifa;
    private Double largura;
    private Double comprimento;
    private Double altura;
    private Double bocalPosX;
    private Double bocalPosY;

    @OneToOne
    @MapsId
    private Pedido pedido;

    public Coifa() {
    }

    public Coifa(Long id,Double largura, Double comprimento, Double altura, Double bocalPosX, Double bocalPosY) {
        this.idCoifa = id;
        this.largura = largura;
        this.comprimento = comprimento;
        this.altura = altura;
        this.bocalPosX = bocalPosX;
        this.bocalPosY = bocalPosY;
    }

    public Long getIdCoifa() {
        return idCoifa;
    }

    public void setIdCoifa(Long id) {
        this.idCoifa = id;
    }

    public Double getLargura() {
        return largura;
    }

    public void setLargura(Double largura) {
        this.largura = largura;
    }

    public Double getComprimento() {
        return comprimento;
    }

    public void setComprimento(Double comprimento) {
        this.comprimento = comprimento;
    }

    public Double getAltura() {
        return altura;
    }

    public void setAltura(Double altura) {
        this.altura = altura;
    }

    public Double getBocalPosX() {
        return bocalPosX;
    }

    public void setBocalPosX(Double bocalPosX) {
        this.bocalPosX = bocalPosX;
    }

    public Double getBocalPosY() {
        return bocalPosY;
    }

    public void setBocalPosY(Double bocalPosY) {
        this.bocalPosY = bocalPosY;
    }



}
