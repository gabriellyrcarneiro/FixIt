# FixIt - Sistema de Suporte Tecnico com Chamados

Projeto integrador fullstack para simular um ambiente de suporte tecnico com abertura, acompanhamento e atendimento de chamados.

## Funcionalidades

- Cadastro e login com senha criptografada usando BCrypt.
- Usuarios comuns podem criar e excluir seus chamados.
- Tecnicos podem se autoatribuir a chamados e alterar o status.
- Admins visualizam todos os chamados e podem atuar como suporte.
- Controle de acesso por perfil: `USER`, `TECHNICIAN` e `ADMIN`.
- Frontend responsivo em React consumindo API REST.
- Banco H2 em memoria para facilitar testes locais.

## Tecnologias

- Backend: Java 17, Spring Boot, Spring Data JPA, H2, spring-security-crypto.
- Frontend: React, Vite, Tailwind CSS.
- Versionamento: Git e GitHub.

## Como executar

### Backend

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.

Console H2: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:fixitdb`
- User: `sa`
- Password: vazio

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface sobe em `http://localhost:5173`.

Para apontar o frontend para outro backend, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## Usuarios de demonstracao

| Perfil | Email | Senha |
| --- | --- | --- |
| Usuario | `usuario@fixit.com` | `usuario123` |
| Tecnico | `tecnico@fixit.com` | `tecnico123` |
| Admin | `admin@fixit.com` | `admin123` |

## Deploy

No Vercel, configure `VITE_API_URL` com a URL HTTPS do backend.

No backend, configure as origens permitidas para CORS com a variavel:

```env
FIXIT_CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app
```

Se o backend estiver em EC2 sem HTTPS, o navegador bloqueara chamadas feitas por uma pagina HTTPS no Vercel. Nesse caso, use um proxy HTTPS, Load Balancer ou configure SSL com Nginx/Certbot.
