package com.br.projeto_integrador.controllers;

import com.br.projeto_integrador.models.Coifa;
import com.br.projeto_integrador.services.CoifaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coifa")
public class CoifaController {

    @Autowired
    private CoifaService service;

    @GetMapping
    public List<Coifa> findAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Coifa findById(@PathVariable("id") Long id){
        return service.findById(id);
    }

    @PostMapping
    public void inserirCoifa(@RequestBody Coifa coifa){
        service.inserirCoifa(coifa);
    }

    @PutMapping
    public void atualizarCoifa(@RequestBody Coifa coifa){
        service.atualizarCoifa(coifa);
    }

    @DeleteMapping(value = "/{id}")
    public void deletarCoifa(@PathVariable("id") Long id){
        service.deletarCoifa(id);
    }
}
