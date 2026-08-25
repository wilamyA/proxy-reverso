## Arquitetura da Solução

```
[ Usuário ] ---> [ Nginx (Porta 8080) ] ---> [ Node.js App (Porta 3000) ] ---> [ MySQL (Porta 3306) ]
```

## Como Executar

### Pré-requisitos
- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### Passo a Passo

1. **Subir os containers:**

   No diretório raiz do projeto (`proxy-reverso`), execute:

   ```bash
   docker compose up -d --build
   ```
   *(ou `docker-compose up -d --build`)*

2. **Acessar a aplicação:**

   Abra o navegador e acesse:
   
   [http://localhost:8080](http://localhost:8080)

3. **Testar o funcionamento:**
   - Ao acessar a URL, você verá a mensagem **Full Cycle Rocks!** e a lista com os nomes cadastrados.
   - A cada atualização da página (F5), um novo nome será automaticamente inserido na tabela `people` do MySQL e a lista será atualizada.
