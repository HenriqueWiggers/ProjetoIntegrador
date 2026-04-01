package com.br.projeto_integrador.repositories;

import com.br.projeto_integrador.models.Coifa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoifaRepository extends JpaRepository<Coifa, Long> {
}
