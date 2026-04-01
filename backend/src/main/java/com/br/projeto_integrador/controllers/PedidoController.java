package com.br.projeto_integrador.controllers;

import com.br.projeto_integrador.models.Coifa;
import com.br.projeto_integrador.models.DTO.AlteraStatusDTO;
import com.br.projeto_integrador.models.Pedido;
import com.br.projeto_integrador.models.enums.StatusPedido;
import com.br.projeto_integrador.services.CoifaService;
import com.br.projeto_integrador.services.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    @Autowired
    private PedidoService service;

    @GetMapping
    public List<Pedido> findAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Pedido findById(@PathVariable("id") Long id){
        return service.findById(id);
    }

    @PostMapping
    public void inserirPedido(@RequestBody Pedido pedido){
        service.inserirPedido(pedido);
    }

    @PutMapping
    public void atualizarPedido(@RequestBody Pedido pedido){
        service.atualizarPedido(pedido);
    }

    @DeleteMapping(value = "/{id}")
    public void deletarPedido(@PathVariable("id") Long id){
        service.deletarPedido(id);
    }

    @GetMapping("/status/{status}")
    public List<Pedido> listarPorStatus(@PathVariable("status") StatusPedido statusPedido) {
        return service.listarPorStatus(statusPedido);
    }

    @PutMapping("/alterar-status")
    public void alterarStatus(@RequestBody AlteraStatusDTO status){
        service.alteraStatus(status.getIdPedido(),status.getStatusPedido());
    }

}
