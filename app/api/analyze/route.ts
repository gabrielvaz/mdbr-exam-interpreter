import { NextRequest } from "next/server";



const EXTRACTION_PROMPT = `
Você é um especialista em interpretação de exames de bioimpedância.
Sua tarefa é analisar a imagem ou texto fornecido e extrair os dados com precisão absoluta.

Siga estritamente as instruções abaixo:

1. **Extrair Dados do Paciente**:
   - Nome completo
   - Idade
   - Sexo
   - Altura
   - Peso
   - CPF (se houver)
   - Data de Nascimento (se houver)

2. **Extrair Métricas (Use SEMPRE termos em Português)**:
   - Peso (kg)
   - IMC (Índice de Massa Corporal)
   - Gordura Corporal (%)
   - Massa Muscular (kg)
   - Água Corporal (%)
   - Gordura Visceral (nível)
   - Massa Óssea (kg)
   - Taxa Metabólica Basal (kcal)
   - Idade Metabólica (anos)
   - Pontuação (Score)

3. **Histórico**:
   - Se houver histórico de exames anteriores, extraia a data, peso, gordura corporal, massa muscular e pontuação de cada um.

4. **Recomendações Práticas (Estruturadas)**:
   - Forneça recomendações específicas baseadas nos resultados, divididas nos seguintes pilares:
     - **Dieta**: Se sugerir déficit calórico, indique EXATAMENTE de quanto deve ser (ex: "Déficit de 300-500 kcal").
     - **Exercício**: Indique uma estimativa de quantas calorias queimar por sessão ou semanalmente.
     - **Hidratação**: Indique a ingestão hídrica diária recomendada com base no peso (ex: "35ml x Peso = X litros").
     - **Sono**: Recomendações de higiene do sono.
     - **Profissional**: Quem procurar (Nutricionista, Educador Físico, etc).
     - **Procedimentos**: Se aplicável.

5. **Formato de Resposta JSON (Obrigatório e ÚNICO)**:
   - Responda APENAS com o JSON abaixo.
   - Não inclua blocos de código markdown (\`\`\`json).
   - Se um valor não existir, use null.

{
  "structured": {
    "patientInfo": {
      "name": string | null,
      "age": string | null,
      "gender": string | null,
      "height": string | null,
      "weight": string | null,
      "cpf": string | null,
      "birthDate": string | null
    },
    "weight": { "value": number | null, "unit": "kg", "status": string },
    "bmi": { "value": number | null, "unit": "kg/m²", "status": string },
    "bodyFat": { "value": number | null, "unit": "%", "status": string },
    "muscleMass": { "value": number | null, "unit": "kg", "status": string },
    "bodyWater": { "value": number | null, "unit": "%", "status": string },
    "visceralFat": { "value": number | null, "unit": "nivel", "status": string },
    "boneMass": { "value": number | null, "unit": "kg", "status": string },
    "bmr": { "value": number | null, "unit": "kcal", "status": string },
    "metabolicAge": { "value": number | null, "unit": "anos", "status": string },
    "score": { "value": number | null, "unit": "/100", "status": string },
    "history": [
      {
        "date": string,
        "weight": number | null,
        "bodyFat": number | null,
        "muscleMass": number | null,
        "score": number | null
      }
    ],
    "recommendations": {
      "diet": string,
      "exercise": string,
      "hydration": string,
      "sleep": string,
      "professional": string,
      "procedures": string
    }
  },
  "rawJson": object
}
`;

const INSIGHTS_PROMPT = `
Você é um fisiologista do exercício e nutricionista de elite.
Com base nos dados JSON extraídos de um exame de bioimpedância, sua tarefa é:

1. **Calcular Insights Avançados**:
   Calcule os seguintes índices (se os dados permitirem) e gere um array de objetos "insights":
   - **Índice de Massa Magra (IMM)**: Massa Magra (kg) / Altura² (m).
   - **Índice de Gordura Magra x Gordura Corporal**: Comparação direta.
   - **Relação Massa Muscular / Gordura Corporal**: Músculo (kg) / Gordura (kg).
   - **TMB Ajustada**: Recalcule ou valide a TMB considerando a massa magra (Fórmula de Katch-McArdle se possível, ou ajuste empírico).
   - **Índice de Risco Metabólico**: Baseado em Gordura Visceral, IMC e % Gordura.
   - **Índice de Qualidade da Composição Corporal**: Uma nota de 0 a 10 baseada na harmonia entre músculo, gordura e água.

   Para cada insight, forneça:
   - "name": Nome do índice.
   - "value": Valor calculado (formatado como string, ex: "22.5 kg/m²").
   - "description": Breve explicação do que significa.
   - "status": "abaixo", "ideal", "acima", "alerta" ou "neutro".

2. **Gerar Explicação Estruturada**:
   Crie uma explicação detalhada e empática para o paciente, dividida em seções claras.
   Gere um array de objetos "structuredExplanation" com as seguintes seções sugeridas (adapte conforme os dados):
   - **Visão Geral**: Resumo do estado geral.
   - **Peso e Gordura Corporal**: Análise detalhada.
   - **Massa Muscular**: Análise da qualidade e quantidade muscular.
   - **Gordura Visceral**: Riscos e estado atual.
   - **Hidratação e Água Corporal**: Estado de hidratação.
   - **Metabolismo e Pontuação Geral**: Idade metabólica vs cronológica.
   - **Evolução no Tempo**: Se houver histórico.
   - **Conclusão**: Fechamento motivacional.

   Para cada seção:
   - "title": Título da seção.
   - "subtitle": Subtítulo curto e impactante (ex: "Acima da meta", "Excelente nível").
   - "content": Texto explicativo claro e direto.

3. **Formato de Resposta JSON (Obrigatório)**:
   Responda APENAS com o JSON abaixo.

{
  "insights": [
    { "name": string, "value": string, "description": string, "status": string }
  ],
  "structuredExplanation": [
    { "title": string, "subtitle": string, "content": string }
  ],
  "explanation": string // Uma versão em texto corrido concatenando as seções para fallback
}
`;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response(JSON.stringify({ error: "Nenhum arquivo enviado" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64File = buffer.toString("base64");
        const mimeType = file.type;

        // --- STEP 1: EXTRACTION ---
        const extractionModels = [
            "google/gemini-2.0-pro-exp-02-05:free",
            "google/gemini-2.5-pro",
            "google/gemini-2.5-flash",
            "google/gemini-2.0-flash-001",
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let extractedData: any = null;
        let extractionError: Error | null = null;

        for (const model of extractionModels) {
            try {
                console.log(`Attempting extraction with model: ${model}`);
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://bioimpedancia-ai.vercel.app",
                        "X-Title": "Bioimpedancia AI",
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "system", content: EXTRACTION_PROMPT },
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: "Analise este exame e extraia os dados." },
                                    { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64File}` } },
                                ],
                            },
                        ],
                        temperature: 0.1,
                    }),
                });

                if (!response.ok) throw new Error(`Extraction failed: ${response.statusText}`);
                const data = await response.json();
                const content = data.choices[0]?.message?.content;
                if (!content) throw new Error("No content in extraction response");

                extractedData = JSON.parse(cleanJson(content));
                break; // Success
            } catch (err) {
                console.warn(`Extraction model ${model} failed:`, err);
                extractionError = err instanceof Error ? err : new Error(String(err));
            }
        }

        if (!extractedData) throw extractionError || new Error("All extraction models failed.");

        // --- STEP 2: INSIGHTS & EXPLANATION ---
        // We use a fast/smart model for reasoning on the JSON data
        const reasoningModel = "google/gemini-2.5-pro"; // Or 2.0-flash if speed is critical, but Pro is better for math/reasoning
        console.log(`Attempting insights generation with model: ${reasoningModel}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let insightsData: any = null;
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://bioimpedancia-ai.vercel.app",
                    "X-Title": "Bioimpedancia AI",
                },
                body: JSON.stringify({
                    model: reasoningModel,
                    messages: [
                        { role: "system", content: INSIGHTS_PROMPT },
                        {
                            role: "user",
                            content: `Aqui estão os dados extraídos do exame: ${JSON.stringify(extractedData)}. Gere os insights e a explicação estruturada.`,
                        },
                    ],
                    temperature: 0.2,
                }),
            });

            if (!response.ok) throw new Error(`Insights generation failed: ${response.statusText}`);
            const data = await response.json();
            const content = data.choices[0]?.message?.content;
            if (!content) throw new Error("No content in insights response");

            insightsData = JSON.parse(cleanJson(content));

        } catch (err) {
            console.error("Insights generation failed, falling back to basic data:", err);
            // Fallback: use extracted data without insights if step 2 fails
            insightsData = {
                insights: [],
                structuredExplanation: [],
                explanation: "Não foi possível gerar a explicação detalhada no momento.",
            };
        }

        // --- MERGE RESULTS ---
        const finalResult = {
            structured: {
                ...extractedData.structured,
                insights: insightsData.insights || [],
            },
            explanation: insightsData.explanation || extractedData.explanation || "", // Prefer insights explanation
            structuredExplanation: insightsData.structuredExplanation || [],
            rawJson: extractedData.rawJson || {},
        };

        return new Response(JSON.stringify(finalResult), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: unknown) {
        console.error("Analysis error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Falha ao processar o exame"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

function cleanJson(text: string): string {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    // Trim whitespace
    cleaned = cleaned.trim();
    return cleaned;
}
