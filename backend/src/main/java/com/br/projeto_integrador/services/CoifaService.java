package com.br.projeto_integrador.services;

import com.br.projeto_integrador.exceptions.RecursoNãoEncontradoException;
import com.br.projeto_integrador.models.Coifa;
import com.br.projeto_integrador.repositories.CoifaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoifaService {

    @Autowired
    private CoifaRepository repository;

    public Coifa findById(Long id){
        return repository.findById(id).orElseThrow(()-> new RecursoNãoEncontradoException("Recurso não localizado com esse ID"));
    }

    public List<Coifa> findAll(){
        List<Coifa> objs = repository.findAll();
        if(objs.isEmpty()){
            throw new RecursoNãoEncontradoException("Essa lista está vazia!");
        }
        return objs;
    }

    public void inserirCoifa(Coifa coifa){
        repository.save(coifa);
    }

    public void atualizarCoifa(Coifa coifa){
        Coifa obj = repository.findById(coifa.getIdCoifa()).orElseThrow(()-> new RecursoNãoEncontradoException("Recurso não localizado com esse ID"));
        obj.setAltura(coifa.getAltura());
        obj.setLargura(coifa.getLargura());
        obj.setComprimento(coifa.getComprimento());
        obj.setBocalPosX(coifa.getBocalPosX());
        obj.setBocalPosY(coifa.getBocalPosY());

        repository.save(obj);
    }

    public void deletarCoifa(Long id){
        repository.delete(repository.findById(id).orElseThrow(()-> new RecursoNãoEncontradoException("Recurso não localizado com esse ID")));
    }

}
