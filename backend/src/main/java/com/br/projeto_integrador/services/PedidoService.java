package com.br.projeto_integrador.services;

import com.br.projeto_integrador.exceptions.RecursoNãoEncontradoException;
import com.br.projeto_integrador.models.Pedido;
import com.br.projeto_integrador.models.enums.StatusPedido;
import com.br.projeto_integrador.repositories.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository repository;

    public Pedido findById(Long id){
        return repository.findById(id).orElseThrow(()-> new RecursoNãoEncontradoException("Recurso não localizado com esse ID"));
    }

    public List<Pedido> findAll(){
        List<Pedido> objs = repository.findAll();
        if(objs.isEmpty()){
            throw new RecursoNãoEncontradoException("Essa lista está vazia!");
        }
        return objs;
    }

    public void inserirPedido(Pedido pedido){
        repository.save(pedido);
    }

    public void atualizarPedido(Pedido pedido){
        Pedido obj = repository.findById(pedido.getIdPedido()).orElseThrow(()-> new RecursoNãoEncontradoException("Recurso não localizado com esse ID"));
        obj.setNomCliente(pedido.getNomCliente());
        obj.setFoneCliente(pedido.getFoneCliente());
        obj.setFoneCliente2(pedido.getFoneCliente2());
        obj.setObsPedido(pedido.getObsPedido());
        obj.setDataPedido(pedido.getDataPedido());
        obj.setDataEntrega(pedido.getDataEntrega());
        obj.setStatusPedido(pedido.getStatusPedido());
        obj.setPreco(pedido.getPreco());

        repository.save(obj);
    }

    public void deletarPedido(Long id){
        repository.delete(repository.findById(id).orElseThrow(()-> new RecursoNãoEncontradoException("Recurso não localizado com esse ID")));
    }

    public List<Pedido> listarPorStatus(StatusPedido statusPedido){
        return repository.findByStatusPedido(statusPedido);
    }

    public void alteraStatus(Long id, StatusPedido statusPedido){
        Pedido obj = repository.findById(id).orElseThrow(()-> new RecursoNãoEncontradoException("Recurso não localizado com esse ID"));
        obj.setNomCliente(obj.getNomCliente());
        obj.setFoneCliente(obj.getFoneCliente());
        obj.setFoneCliente2(obj.getFoneCliente2());
        obj.setObsPedido(obj.getObsPedido());
        obj.setDataPedido(obj.getDataPedido());
        obj.setDataEntrega(obj.getDataEntrega());
        obj.setStatusPedido(statusPedido);
        obj.setPreco(obj.getPreco());
        repository.save(obj);
    }

}
