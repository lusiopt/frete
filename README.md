# 📦 Frete - Simulador de Cotação de Frete Internacional

Aplicação web para simulação de cotações de frete internacional usando a API ShipSmart. Desenvolvido para facilitar a comparação de preços e prazos entre diferentes transportadoras.

---

## 🚀 Stack Técnico

- **Framework**: Next.js 16.0.1 (App Router + Turbopack)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.0.0
- **UI Components**: shadcn/ui
- **API Externa**: ShipSmart API v2
- **Deploy**: VPS Nginx + PM2

---

## 🌐 URLs e Ambientes

### Produção
- **URL**: https://dev.lusio.market/frete/
- **Branch**: `main`
- **Servidor**: VPS 72.61.165.88
- **PM2**: `frete-dev` (porta 3010)
- **Diretório**: `/var/www/dev/frete-app/`

### Local
- **URL**: http://localhost:3010
- **Branch**: `main`
- **Comando**: `pnpm dev`

---

## 🔧 Configuração

### Variáveis de Ambiente

**`.env` (Produção VPS):**
```env
SHIPSMART_API_KEY=seu_token_aqui
SHIPSMART_API_URL=https://api.shipsmart.com.br/v2
NODE_ENV=production
```

**`.env.local` (Desenvolvimento):**
```env
SHIPSMART_API_KEY=seu_token_aqui
SHIPSMART_API_URL=https://api.shipsmart.com.br/v2
NODE_ENV=development
```

### Next.js Config

O projeto usa `basePath: "/frete"` em produção para servir em subpath do domínio.

**`next.config.ts`:**
```typescript
const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/frete' : '',
  // ...
};
```

---

## 📋 Comandos

### Desenvolvimento
```bash
# Instalar dependências
pnpm install

# Servidor de desenvolvimento (porta 3010)
pnpm dev

# Build de produção
pnpm build

# Iniciar produção
pnpm start

# Linting
pnpm lint
```

### Deploy
```bash
# Deploy completo para dev.lusio.market
git add .
git commit -m "sua mensagem"
git push origin main

# Deploy automático na VPS
ssh root@72.61.165.88 'cd /var/www/dev/frete-app && git pull origin main && npm run build && pm2 restart frete-dev'
```

---

## 📁 Estrutura do Projeto

```
frete/
├── app/
│   ├── api/
│   │   └── quotation/
│   │       └── route.ts          # API proxy para ShipSmart
│   ├── globals.css               # Estilos globais + Tailwind
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial (formulário)
│
├── components/
│   ├── forms/
│   │   └── quotation-form.tsx    # Formulário de cotação
│   ├── quotation-results.tsx     # Cards de resultados
│   └── ui/                       # Componentes shadcn/ui
│
├── lib/
│   ├── address-data.ts           # Países, estados, envelopes
│   └── utils.ts                  # Funções utilitárias
│
├── types/
│   └── shipsmart.ts              # Types da API ShipSmart
│
├── next.config.ts                # Configuração Next.js
├── tailwind.config.ts            # Configuração Tailwind
└── package.json                  # Dependências do projeto
```

---

## ✨ Features

### Funcionalidades Principais

✅ **Cotação de Documentos**
- Envelope A4, C4, C5, DL, Legal, Letter, Acolchoado
- Auto-preenchimento de dimensões por tipo de envelope
- Validação automática de campos obrigatórios

✅ **Endereços Suportados**
- **Origem**: Brasil (todos estados)
- **Destino**: Portugal (Lisboa e outros distritos)
- Seleção por país → estado/distrito

✅ **Configurações de Frete**
- Tipo de cotação: Simples, Avançado, Itens
- Quem paga imposto: Remetente/Destinatário
- Sistema de medidas: Métrico/Imperial
- Moeda: USD/BRL
- Seguro opcional
- Entrega residencial

✅ **Resultados Inteligentes**
- **Resumo**: Mostra mais barato e mais rápido
- **Comparação**: 3 transportadoras (DHL, FedEx, UPS)
- **Detalhes**: Prazo, peso, frete, validade
- **Destaque visual**: Borda verde (barato) / azul (rápido)
- **UI Compacta**: Cards otimizados ~40% menores

### Otimizações Implementadas

✅ **Performance**
- Next.js 16 com Turbopack (build ~1.7s)
- Static pages para home
- API routes otimizadas
- Imagens otimizadas (next/image)

✅ **UX/UI**
- Interface responsiva (mobile-first)
- Loading states em todos os formulários
- Mensagens de erro claras e em português
- Cards compactos com todas informações
- Badges visuais (Mais Barato/Mais Rápido)

✅ **Developer Experience**
- TypeScript em 100% do código
- Componentes reutilizáveis (shadcn/ui)
- Linting e formatação automática
- Variáveis de ambiente tipadas

---

## 🔍 API ShipSmart

### Endpoint Usado
```
POST https://api.shipsmart.com.br/v2/quotation
Authorization: Bearer {API_KEY}
```

### Payload de Exemplo (Documento)
```json
{
  "object": "doc",
  "type": "simple",
  "tax": "sender",
  "insurance": false,
  "currency_quote": "USD",
  "currency_payment": "BRL",
  "measurement": "metric",
  "residential_delivery": false,
  "non_stackable": false,
  "address_sender": {
    "country_code": "BR",
    "state_code": "CE"
  },
  "address_receiver": {
    "country_code": "PT",
    "state_code": "11"
  },
  "boxes": [{
    "name": "Envelope A4",
    "height": 1,
    "width": 22,
    "depth": 31,
    "weight": 0.1,
    "price": 10
  }]
}
```

### Resposta de Exemplo
```json
{
  "status": "success",
  "message": "Cotação Realizada com sucesso!",
  "data": {
    "quotation": "uuid",
    "carriers": [
      {
        "code": 1897,
        "name": "DHL",
        "transit_days": 6,
        "freight": "26.44",
        "currency_payment_amount": "140.41"
      }
    ]
  }
}
```

---

## 🐛 Problemas Resolvidos

### Problema 1: Campo `price` obrigatório faltando
**Erro**: `boxes.0.price é obrigatório`

**Causa**: Estado `boxes` não tinha campo `price` inicializado

**Solução**:
- Adicionado `price: 10` no useState inicial (linha 71)
- Adicionado `price: 10` no useEffect do envelope (linha 106)
- Mantido `price: 10` na função addBox (linha 122)

**Commit**: `f57f811`

---

### Problema 2: URL da API incorreta
**Erro**: `404 Not Found` ao chamar `/api/quotation`

**Causa**: Next.js configurado com `basePath: "/frete"` mas frontend chamando URL sem prefixo

**Solução**:
- Alterada URL de `/api/quotation` → `/frete/api/quotation`
- Removidos logs de debug do frontend e backend

**Commit**: `21dcd3d`

**Por que funcionava via curl?**
- curl usava URL completa correta: `/frete/api/quotation`
- Frontend usava URL relativa sem basePath: `/api/quotation` ❌

---

### Problema 3: Cards muito grandes
**Feedback do usuário**: "Cards ficaram muito grandes, sem perder informação"

**Solução**: Otimização completa do layout
- Padding reduzido: `pt-6` → `p-4` (-33%)
- Logo menor: `w-24 h-12` → `w-16 h-8` (-33%)
- Fontes menores: `text-xl` → `text-base`, `text-3xl` → `text-2xl`
- Grid otimizado: 4 colunas → 3 colunas
- Rodapé horizontal (antes vertical)
- Ícones menores: `h-4 w-4` → `h-3.5 w-3.5`

**Resultado**: Cards ~40% mais compactos mantendo 100% da informação

**Commit**: `d6a7ed5`

---

## 📝 Lições Aprendidas

### 1. Next.js basePath
- **SEMPRE** usar `basePath` nas URLs de API quando configurado
- Testar com curl não garante que o frontend funciona
- Em produção com subpath, todas as rotas precisam do prefixo

### 2. Estado React
- Inicializar **TODOS** os campos obrigatórios da API no estado
- Não confiar em fallbacks de UI (`|| 10`) - o estado real é o que importa
- Garantir que useEffect preserve todos os campos ao atualizar

### 3. UX/UI
- Cards grandes desperdiçam espaço em telas pequenas
- Densidade visual pode ser aumentada sem perder legibilidade
- Usuários valorizam compactação quando mantém informação

### 4. Debugging
- Logs temporários ajudam mas devem ser removidos
- Testar em múltiplos ambientes (curl, navegador, aba anônima)
- Problema nem sempre está onde parece estar (não era cache!)

---

## 🔄 Histórico de Versões

### v1.0.0 (11 Nov 2025) - Versão Funcional ✅
- ✅ Implementação completa do formulário de cotação
- ✅ Integração com API ShipSmart funcionando
- ✅ Resultados com 3 transportadoras
- ✅ UI compacta e otimizada
- ✅ Deploy em produção (dev.lusio.market/frete)
- ✅ Documentação completa

**Commits principais:**
- `f57f811` - Fix: campo price obrigatório
- `21dcd3d` - Fix: URL da API com basePath
- `d6a7ed5` - Feat: otimizar UI dos cards

---

## 🚧 TODOs / Roadmap

### Features Futuras
- [ ] Suporte para cotação de mercadorias (não apenas documentos)
- [ ] Mais países de origem/destino
- [ ] Histórico de cotações
- [ ] Comparação lado a lado
- [ ] Exportar resultados (PDF/Excel)
- [ ] Rastreamento de envios
- [ ] Calculadora de peso volumétrico

### Melhorias Técnicas
- [ ] Testes automatizados (Playwright)
- [ ] Cache de cotações recentes
- [ ] Retry automático em caso de erro
- [ ] Rate limiting no backend
- [ ] Logs estruturados (winston/pino)
- [ ] Monitoramento de erros (Sentry)

### UX/UI
- [ ] Dark mode
- [ ] Animações de transição
- [ ] Gráficos de comparação
- [ ] Favoritar transportadoras
- [ ] Ordenação customizável (preço/prazo)

---

## 📞 Suporte

**Repositório**: https://github.com/lusiopt/frete
**Deploy**: dev.lusio.market/frete
**Mantido por**: Euclides Gomes + Claude Code
**Última Atualização**: 11 Novembro 2025

---

## 📄 Licença

Projeto privado - Todos os direitos reservados.
