import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from 'react-bootstrap/Pagination';
import Table from "react-bootstrap/Table";
import {
  validarCelular,
  validarFixo,
  validarNumero,
  validarAlfabeto,
  validarBloco,
} from "./ValidacoesAp";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function TabelaAp() {
  const [dadosTabela, setDadosTabela] = useState([]);
  const [idLinhaEdicao, setIdLinhaEdicao] = useState(null);
  const [linhaVaziaId, setLinhaVaziaId] = useState(null);
  const [linhaEdicaoOriginal, setLinhaEdicaoOriginal] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ultimoId, setUltimoId] = useState(0);

  useEffect(() => {
    // LÓGICA DA REQUISIÇÃO AQUI
    // Esses dados são só para simular, pode usar o espaço para fazer a lógica da requisição
    const buscarDados = async () => {
      const dadosDoBanco = [
        {
          id: 1,
          numeroAp: "101",
          nome: "João da Silva",
          email: "joao@gmail.com",
          bloco: "1A",
          celular: "(00) 99999-9999",
          fixo: "(00) 9999-9999",
        },
      ];
      setDadosTabela(dadosDoBanco);
    };

    buscarDados();
  }, []);

  const adicionarNovaLinha = () => {
    const novoId = ultimoId ? ultimoId + 1 : 1;
    const novaLinha = {
      id: novoId,
      numeroAp: "",
      nome: "",
      email: "",
      bloco: "",
      celular: "",
      fixo: "",
    };
    setDadosTabela([novaLinha, ...dadosTabela]);
    setIdLinhaEdicao(novoId);
    setLinhaVaziaId(novoId);
    setUltimoId(novoId); // Atualiza o último ID
  };

  // VALIDAÇÕES//

  const atualizarDadosLinha = (index, chave, valor) => {
    let novoValor = valor;

    if (chave === "bloco") {
      if (!validarBloco(valor)) {
        return; // Se não for válido, não atualiza o estado
      }
    }

    if (chave === "numeroAp") {
      // A validação para numeroAp continua a mesma
      if (!validarNumero(valor)) {
        return; // Se não for válido, não atualiza o estado
      }
    } else if (chave === "celular") {
      // Adicionando a validação para celular
      if (!validarCelular(valor)) {
        return; // Se não for válido, não atualiza o estado
      }
    } else if (chave === "fixo") {
      // Adicionando a validação para fixo
      if (!validarFixo(valor)) {
        return; // Se não for válido, não atualiza o estado
      }
    } else if (chave === "nome") {
      if (!validarAlfabeto(valor)) {
        return; // Se não for válido, não atualiza o estado
      }
    }

    const novosDados = [...dadosTabela];
    novosDados[index][chave] = novoValor;
    setDadosTabela(novosDados);
  };

  // SALVAR NOVA LINHA
  const salvarLinha = (id) => {
    const indiceLinha = dadosTabela.findIndex((linha) => linha.id === id);
    const linha = dadosTabela[indiceLinha];
    // Verificar se todos os campos obrigatórios estão preenchidos, exceto o campo "Bloco"
    const camposObrigatoriosPreenchidos = Object.entries(linha).every(
      ([chave, valor]) => {
        // Verificar se a chave não é "bloco" e se o valor é vazio
        if (chave !== "bloco" && valor === "") {
          return false;
        }
        return true;
      }
    );
    // Se algum campo obrigatório estiver vazio (exceto "Bloco"), retorna sem salvar a linha
    if (!camposObrigatoriosPreenchidos) {
      return;
    }
    setIdLinhaEdicao(null);
    setLinhaVaziaId(null);
  };

  const excluirLinha = (id) => {
    setDadosTabela(dadosTabela.filter((linha) => linha.id !== id));
  };

  // CANCELAR A NOVA LINHA ADICIONADA

  const cancelarEdicao = (id) => {
    if (linhaVaziaId === id) {
      excluirLinha(id);
    } else {
      const novosDados = dadosTabela.map((linha) =>
        linha.id === id ? linhaEdicaoOriginal : linha
      );
      setDadosTabela(novosDados);
    }
    setIdLinhaEdicao(null);
    setLinhaVaziaId(null);
  };

  // EDITAR
  const iniciarEdicao = (id) => {
    const linha = dadosTabela.find((linha) => linha.id === id);
    setLinhaEdicaoOriginal({ ...linha });
    setIdLinhaEdicao(id);
  };

  const isSaveDisabled = (id) => {
    const indiceLinha = dadosTabela.findIndex((linha) => linha.id === id);
    const linha = dadosTabela[indiceLinha];
    // Verificar se algum campo obrigatório, exceto o campo "Bloco", está vazio
    const algumCampoObrigatorioVazio = Object.entries(linha).some(
      ([chave, valor]) => {
        // Verificar se a chave não é "bloco" e se o valor é vazio
        if (chave !== "bloco" && valor === "") {
          return true;
        }
        return false;
      }
    );
    // Se algum campo obrigatório estiver vazio (exceto "Bloco"), o botão Salvar estará desativado
    return algumCampoObrigatorioVazio;
  };

  // PAGINAÇÃO
  const linhasPorPagina = 6;
  const numeroTotalPaginas = Math.ceil(dadosTabela.length / linhasPorPagina);
  const indiceUltimaLinha = paginaAtual * linhasPorPagina;
  const indicePrimeiraLinha = indiceUltimaLinha - linhasPorPagina;
  const linhasPaginaAtual = dadosTabela.slice(
    indicePrimeiraLinha,
    indiceUltimaLinha
  );

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const handleProximaPagina = () => {
    if (paginaAtual < numeroTotalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Apartamentos</h2>
        <Button
          style={{ backgroundColor: "#006400", borderColor: "#006400" }}
          onClick={adicionarNovaLinha}
        >
          Adicionar Apartamento
        </Button>
      </div>
      <Table striped bordered hover>
        <thead className="thead-dark">
          <tr>
            <th scope="col">Número do Ap</th>
            <th scope="col">Nome</th>
            <th scope="col">Email</th>
            <th scope="col">Bloco</th>
            <th scope="col">Telefone Celular</th>
            <th scope="col">Telefone Fixo</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {linhasPaginaAtual.map((linha, index) => (
            <tr key={linha.id}>
              <th scope="row">
                {idLinhaEdicao === linha.id ? (
                  <Form.Control
                    type="text"
                    value={linha.numeroAp}
                    onChange={(e) =>
                      atualizarDadosLinha(index, "numeroAp", e.target.value)
                    }
                  />
                ) : (
                  linha.numeroAp
                )}
              </th>
              <td>
                {idLinhaEdicao === linha.id ? (
                  <Form.Control
                    type="text"
                    value={linha.nome}
                    onChange={(e) =>
                      atualizarDadosLinha(index, "nome", e.target.value)
                    }
                  />
                ) : (
                  linha.nome
                )}
              </td>
              <td>
                {idLinhaEdicao === linha.id ? (
                  <Form.Control
                    type="email"
                    value={linha.email}
                    onChange={(e) =>
                      atualizarDadosLinha(index, "email", e.target.value)
                    }
                  />
                ) : (
                  linha.email
                )}
              </td>

              <td>
                {idLinhaEdicao === linha.id ? (
                  <Form.Control
                    type="text"
                    value={linha.bloco}
                    onChange={(e) =>
                      atualizarDadosLinha(index, "bloco", e.target.value)
                    }
                  />
                ) : (
                  linha.bloco
                )}
              </td>
              <td>
                {idLinhaEdicao === linha.id ? (
                  <Form.Control
                    type="text"
                    value={linha.celular}
                    onChange={(e) =>
                      atualizarDadosLinha(index, "celular", e.target.value)
                    }
                  />
                ) : (
                  linha.celular
                )}
              </td>
              <td>
                {idLinhaEdicao === linha.id ? (
                  <Form.Control
                    type="text"
                    value={linha.fixo}
                    onChange={(e) =>
                      atualizarDadosLinha(index, "fixo", e.target.value)
                    }
                  />
                ) : (
                  linha.fixo
                )}
              </td>
              <td>
                {idLinhaEdicao === linha.id ? (
                  <>
                    <Button
                      variant="success"
                      onClick={() => salvarLinha(linha.id)}
                      disabled={isSaveDisabled(linha.id)}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => cancelarEdicao(linha.id)}
                      className="ml-2"
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="warning"
                      onClick={() => iniciarEdicao(linha.id)}
                      className="mr-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => excluirLinha(linha.id)}
                    >
                      <FaTrash />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev onClick={handlePaginaAnterior} />
        {Array.from({ length: numeroTotalPaginas }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === paginaAtual}
            onClick={() => setPaginaAtual(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={handleProximaPagina} />
      </Pagination>
    </>
  );
}